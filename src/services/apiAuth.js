/* eslint-disable no-unused-vars */
import supabase from "./supabase";

// Şifre sıfırlama e-postası gönderme fonksiyonu
export async function resetPassword(email) {
  try {
    // Şifre sıfırlama isteği gönder
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    throw error;
  }
}

// Yeni fonksiyon: Google ile oturum açma
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    console.error("Google ile oturum açma hatası:", error.message);
    return { error };
  }

  return { data };
}

// Halihazırdaki fonksiyonlar
export async function signup({ email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;
  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data?.user;
}

// Kullanıcının anonim olup olmadığını kontrol et
export async function isUserAnonymous() {
  const currentUser = await getCurrentUser();

  // Kullanıcı giriş yapmamışsa veya oturum yoksa
  if (!currentUser) return false;

  // Supabase'de anonim kullanıcıların oturum açma yöntemini kontrol et
  // Anonim kullanıcılar genellikle email yoktur veya özel bir provider değeri vardır
  const isAnonymous =
    localStorage.getItem("isAnonymous") === "true" ||
    !currentUser.email ||
    currentUser.app_metadata?.provider === "anonymous";

  // Eğer oturum açılmış bir kullanıcı varsa ve anonim değilse, localStorage'daki isAnonymous değerini temizle
  if (currentUser && !isAnonymous) {
    localStorage.removeItem("isAnonymous");
  }

  return isAnonymous;
}

// Kullanıcı oturum kontrolü için kapsamlı fonksiyon
export async function checkAuthStatus() {
  const currentUser = await getCurrentUser();
  const userIsAnonymous = await isUserAnonymous();

  return {
    isLoggedIn: !!currentUser,
    isAnonymous: userIsAnonymous,
    user: currentUser,
  };
}

export async function logout() {
  try {
    // Tüm localStorage ve çerezleri temizle
    clearAllStorageAndCookies();

    // Supabase ile oturumu kapat
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("Oturum kapatma hatası:", error.message);
    throw error;
  }
}

// Tüm localStorage ve çerezleri temizleyen yardımcı fonksiyon
function clearAllStorageAndCookies() {
  // Tüm localStorage temizle
  localStorage.clear();

  // Supabase oturum anahtarını özel olarak temizle
  const supabaseKey = Object.keys(localStorage).find((key) =>
    key.includes("-auth-token")
  );
  if (supabaseKey) {
    localStorage.removeItem(supabaseKey);
  }

  // Tüm çerezleri temizle
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  // Tarayıcı özel oturum depolamasını temizle
  sessionStorage.clear();

  console.log("Tüm veriler ve çerezler temizlendi");
}

// Kullanıcı güncelleme fonksiyonu
export async function updateCurrentUser({ email, password, fullName, avatar }) {
  let updates = {};

  if (email) updates.email = email;
  if (password) updates.password = password;

  // Metadata güncelleme
  if (fullName || avatar) {
    updates.data = {};
    if (fullName) updates.data.fullName = fullName;
  }

  const { data, error } = await supabase.auth.updateUser(updates);

  if (error) {
    console.error("Kullanıcı güncellenemedi:", error.message);
    throw new Error(error.message);
  }

  // Avatar yükleme işlemi
  if (avatar) {
    const fileName = `avatar-${data.user.id}-${Math.random()}`;

    const { error: storageError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatar);

    if (storageError) {
      console.error("Avatar yüklenemedi:", storageError.message);
      throw new Error(storageError.message);
    }

    // Avatar URL'ini kullanıcı metadata'sına ekle
    const { data: avatarData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...updates.data,
        avatar: avatarData.publicUrl,
      },
    });

    if (updateError) {
      console.error("Avatar URL'i güncellenemedi:", updateError.message);
      throw new Error(updateError.message);
    }
  }

  return data;
}

// Anonim giriş fonksiyonu
export async function signInAsGuest() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "anonymous",
    });

    if (error) {
      console.error("Anonim oturum açma hatası:", error.message);
      return;
    }

    if (data) {
      // Anonim oturum açıldığında isAnonymous değerini localStorage'a kaydet
      localStorage.setItem("isAnonymous", "true");
      console.log("Anonim kullanıcı oturum açtı.");
    }
  } catch (error) {
    console.error("Anonim oturum açma sırasında hata oluştu:", error.message);
  }
}

// Anonim kullanıcıyı kayıtlı kullanıcıya çevirme fonksiyonu
export async function convertAnonymousToUser({ email, password }) {
  try {
    const { data: session, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !session?.session?.user) {
      throw new Error("Anonim kullanıcı bulunamadı.");
    }

    const anonymousUserId = session.session.user.id;

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      { email, password }
    );

    if (signUpError) {
      throw new Error(signUpError.message);
    }

    const localAnswers = JSON.parse(localStorage.getItem("userSelections"));

    if (localAnswers) {
      await syncAnonymousDataToUser(
        anonymousUserId,
        signUpData.user.id,
        localAnswers
      );
    }

    // Anonim durumu kaldır
    localStorage.removeItem("isAnonymous");
    localStorage.removeItem("userSelections");

    return signUpData;
  } catch (error) {
    console.error("Kullanıcı dönüşümü sırasında hata:", error.message);
    throw new Error(error.message);
  }
}

async function syncAnonymousDataToUser(anonymousId, newUserId, answers) {
  const { error } = await supabase
    .from("userAnswers")
    .update({ userId: newUserId })
    .eq("userId", anonymousId);

  if (error) {
    throw new Error(error.message);
  }
}
