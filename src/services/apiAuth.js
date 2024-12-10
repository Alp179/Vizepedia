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
export async function updateCurrentUser({ email, password }) {
  const updates = {};
  if (email) updates.email = email; // E-posta adresini ekleyin
  if (password) updates.password = password; // Şifreyi ekleyin

  const { data, error } = await supabase.auth.updateUser(updates);

  if (error) {
    console.error("Kullanıcı güncellenemedi:", error.message);
    throw new Error(error.message);
  }

  console.log("Güncelleme başarılı:", data);
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
      await syncAnonymousDataToUser(anonymousUserId, signUpData.user.id, localAnswers);
    }

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
