/* eslint-disable no-unused-vars */
import supabase from "./supabase";
import { AnonymousDataService } from "../utils/anonymousDataService";

// Şifre sıfırlama e-postası gönderme fonksiyonu
export async function resetPassword(email) {
  try {
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

// Google ile oturum açma
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
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return null;
    
    const { data, error } = await supabase.auth.getUser();

    if (error) throw new Error(error.message);

    return data?.user;
  } catch (error) {
    // Safely handle errors without breaking the app
    console.error("Auth error:", error);
    return null;
  }
}

// Keep the original function but make it safe
export async function isUserAnonymous() {
  // First check localStorage (no Supabase call)
  if (AnonymousDataService.isAnonymousUser()) {
    return true;
  }

  // Check if it's a bot (no Supabase call)
  if (AnonymousDataService.isBotUser()) {
    return false; // Bots are not anonymous users, they're bots
  }

  try {
    const currentUser = await getCurrentUser();

    // If no user, not anonymous (just not logged in)
    if (!currentUser) return false;

    // If user exists and has email, definitely not anonymous
    if (currentUser.email) {
      // Clear any stale anonymous flags
      localStorage.removeItem("isAnonymous");
      return false;
    }

    // If user exists but no email, might be anonymous session
    const isAnonymous = currentUser.app_metadata?.provider === "anonymous";
    
    return isAnonymous;
  } catch (error) {
    console.error("Error checking anonymous status:", error);
    return false;
  }
}

// Keep original checkAuthStatus but enhance it
export async function checkAuthStatus() {
  try {
    // Check bot first (no Supabase interaction)
    if (AnonymousDataService.isBotUser()) {
      return {
        isLoggedIn: false,
        isAnonymous: false,
        user: null,
        userType: 'bot'
      };
    }

    // Check localStorage anonymous flag
    if (AnonymousDataService.isAnonymousUser()) {
      return {
        isLoggedIn: false,
        isAnonymous: true,
        user: null,
        userType: 'anonymous'
      };
    }

    // Check actual Supabase auth
    const currentUser = await getCurrentUser();
    const userIsAnonymous = await isUserAnonymous();

    return {
      isLoggedIn: !!currentUser,
      isAnonymous: userIsAnonymous,
      user: currentUser,
      userType: currentUser ? 'authenticated' : 'new_visitor'
    };
  } catch (error) {
    console.error("Error checking auth status:", error);
    return {
      isLoggedIn: false,
      isAnonymous: false,
      user: null,
      userType: 'new_visitor'
    };
  }
}

export async function logout() {
  try {
    // Clear anonymous data if user was anonymous
    if (AnonymousDataService.isAnonymousUser()) {
      AnonymousDataService.clearData();
      return;
    }

    // Clear all storage and Supabase session
    clearAllStorageAndCookies();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("Oturum kapatma hatası:", error.message);
    throw error;
  }
}

function clearAllStorageAndCookies() {
  localStorage.clear();

  const supabaseKey = Object.keys(localStorage).find((key) =>
    key.includes("-auth-token")
  );
  if (supabaseKey) {
    localStorage.removeItem(supabaseKey);
  }

  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  sessionStorage.clear();
  console.log("Tüm veriler ve çerezler temizlendi");
}

export async function updateCurrentUser({ email, password, fullName, avatar }) {
  let updates = {};

  if (email) updates.email = email;
  if (password) updates.password = password;

  if (fullName || avatar) {
    updates.data = {};
    if (fullName) updates.data.fullName = fullName;
  }

  const { data, error } = await supabase.auth.updateUser(updates);

  if (error) {
    console.error("Kullanıcı güncellenemedi:", error.message);
    throw new Error(error.message);
  }

  if (avatar) {
    const fileName = `avatar-${data.user.id}-${Math.random()}`;

    const { error: storageError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatar);

    if (storageError) {
      console.error("Avatar yüklenemedi:", storageError.message);
      throw new Error(storageError.message);
    }

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

// DISABLE the problematic anonymous functions instead of removing them
export async function signInAsGuest() {
  // DISABLED: Don't create Supabase anonymous sessions
  console.log("Anonymous Supabase sessions disabled for AdSense compliance");
  
  // Instead, just mark as anonymous in localStorage
  AnonymousDataService.saveUserSelections({});
  
  return {
    data: { user: null },
    error: null
  };
}

export async function convertAnonymousToUser({ email, password }) {
  try {
    // Don't try to convert Supabase anonymous users, just sign up normally
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      throw new Error(signUpError.message);
    }

    // Migrate localStorage data to new user
    if (signUpData.user) {
      await migrateAnonymousToAuthenticated(signUpData.user.id);
    }

    return signUpData;
  } catch (error) {
    console.error("Kullanıcı dönüşümü sırasında hata:", error.message);
    throw new Error(error.message);
  }
}

// New migration function for localStorage to Supabase
export async function migrateAnonymousToAuthenticated(userId) {
  try {
    const anonymousData = AnonymousDataService.prepareDataForMigration();
    
    if (!anonymousData.userAnswers) {
      console.log("No anonymous data to migrate");
      return null;
    }

    const { data, error } = await supabase
      .from("userAnswers")
      .insert({
        userId: userId,
        ans_country: anonymousData.userAnswers.ans_country,
        ans_purpose: anonymousData.userAnswers.ans_purpose,
        ans_profession: anonymousData.userAnswers.ans_profession,
        ans_vehicle: anonymousData.userAnswers.ans_vehicle,
        ans_kid: anonymousData.userAnswers.ans_kid,
        ans_accommodation: anonymousData.userAnswers.ans_accommodation,
        ans_hassponsor: anonymousData.userAnswers.ans_hassponsor,
        ans_sponsor_profession: anonymousData.userAnswers.ans_sponsor_profession,
        has_appointment: false,
        has_filled_form: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error migrating anonymous data:", error);
      return null;
    }

    // Migrate completed documents
    if (anonymousData.completedDocuments && Object.keys(anonymousData.completedDocuments).length > 0) {
      const completedDocsToInsert = [];
      
      Object.values(anonymousData.completedDocuments).forEach(appDocs => {
        Object.values(appDocs).forEach(doc => {
          completedDocsToInsert.push({
            userId: userId,
            document_name: doc.document_name,
            completion_date: doc.completion_date,
            status: doc.status,
            application_id: data.id
          });
        });
      });

      if (completedDocsToInsert.length > 0) {
        await supabase.from("completed_documents").insert(completedDocsToInsert);
      }
    }

    // Clear anonymous data after successful migration
    AnonymousDataService.clearData();

    console.log("Anonymous data successfully migrated to authenticated user");
    return data;

  } catch (error) {
    console.error("Error during anonymous data migration:", error);
    return null;
  }
}

// Keep existing sync function for compatibility
async function syncAnonymousDataToUser(anonymousId, newUserId, answers) {
  const { error } = await supabase
    .from("userAnswers")
    .update({ userId: newUserId })
    .eq("userId", anonymousId);

  if (error) {
    throw new Error(error.message);
  }
}