/* eslint-disable no-unused-vars */
import supabase from "./supabase";

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

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

// Kullanıcı güncelleme fonksiyonu
export async function updateCurrentUser({ password }) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw new Error(error.message);

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
    // Supabase'den mevcut anonim kullanıcıyı alın
    const { data: session, error: sessionError } =
      await supabase.auth.getSession();

    // Debugging: Session ve error durumunu kontrol edelim
    console.log("Session bilgisi: ", session);
    console.log("Session Hatası: ", sessionError);

    // Eğer session veya session.user undefined ise hata fırlat
    if (sessionError || !session || !session.session || !session.session.user) {
      throw new Error("Anonim kullanıcı bulunamadı.");
    }

    const anonymousUserId = session.session.user.id; // Anonim kullanıcı ID'si

    // E-posta ve şifre ile yeni bir hesap oluşturun
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );

    if (signUpError) {
      throw new Error(signUpError.message);
    }

    // Anonim kullanıcıya ait olan yerel verileri yeni kullanıcıya aktarın
    const localAnswers = JSON.parse(localStorage.getItem("userSelections"));

    if (localAnswers) {
      await syncAnonymousDataToUser(
        anonymousUserId,
        signUpData.user.id,
        localAnswers
      );
    }

    // LocalStorage'dan anonim kullanıcı bilgilerini temizleyin
    localStorage.removeItem("isAnonymous");
    localStorage.removeItem("userSelections");

    return signUpData;
  } catch (error) {
    // Hata durumunda hata mesajını yakala ve döndür
    console.error("Kullanıcı dönüşümü sırasında hata:", error.message);
    throw new Error(error.message);
  }
}

// Anonim verilerin yeni kullanıcı ile eşleştirilmesi
async function syncAnonymousDataToUser(anonymousId, newUserId, answers) {
  const { data, error } = await supabase
    .from("userAnswers")
    .update({ userId: newUserId }) // user_id yerine "userId" kullanıyoruz
    .eq("userId", anonymousId); // Anonim kullanıcının "userId" sini güncelliyoruz

  if (error) {
    throw new Error(error.message);
  }

  // Gerekirse, answers gibi diğer anonim verileri de buradan işleyebilirsiniz
}
