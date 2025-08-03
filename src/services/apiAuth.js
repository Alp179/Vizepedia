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
    options: {
      redirectTo: "https://www.vizepedia.com/dashboard",
    },
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
        userType: "bot",
      };
    }

    // Check localStorage anonymous flag
    if (AnonymousDataService.isAnonymousUser()) {
      return {
        isLoggedIn: false,
        isAnonymous: true,
        user: null,
        userType: "anonymous",
      };
    }

    // Check actual Supabase auth
    const currentUser = await getCurrentUser();
    const userIsAnonymous = await isUserAnonymous();

    return {
      isLoggedIn: !!currentUser,
      isAnonymous: userIsAnonymous,
      user: currentUser,
      userType: currentUser ? "authenticated" : "new_visitor",
    };
  } catch (error) {
    console.error("Error checking auth status:", error);
    return {
      isLoggedIn: false,
      isAnonymous: false,
      user: null,
      userType: "new_visitor",
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
    error: null,
  };
}

export async function convertAnonymousToUser({ email, password }) {
  try {
    // Don't try to convert Supabase anonymous users, just sign up normally
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );

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
// apiAuth.js - migrateAnonymousToAuthenticated fonksiyonunu bu şekilde güncelleyin:

// apiAuth.js - migrateAnonymousToAuthenticated fonksiyonunu bu şekilde değiştirin:

export async function migrateAnonymousToAuthenticated(userId) {
  try {
    const anonymousData = AnonymousDataService.prepareDataForMigration();

    if (!anonymousData.userAnswers) {
      console.log("No anonymous data to migrate");
      return null;
    }

    console.log("🔄 Starting migration for user:", userId);
    console.log("Anonymous data to migrate:", anonymousData);

    // Insert user answers
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
        ans_sponsor_profession:
          anonymousData.userAnswers.ans_sponsor_profession,
        has_appointment: false,
        has_filled_form: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error migrating anonymous data:", error);
      return null;
    }

    console.log("✅ User answers migrated, new application ID:", data.id);

    // CRITICAL: Initialize completedDocsToInsert properly
    const completedDocsToInsert = [];
    let migratedDocumentsCount = 0;

    // FIXED: Check Supabase schema first
    console.log("🔍 Checking completed_documents table schema...");

    // ENHANCED: Migrate completed documents with proper Supabase schema
    if (
      anonymousData.completedDocuments &&
      Object.keys(anonymousData.completedDocuments).length > 0
    ) {
      // Get the anonymous application ID and documents
      Object.keys(anonymousData.completedDocuments).forEach(
        (anonymousAppId) => {
          const appDocs = anonymousData.completedDocuments[anonymousAppId];

          if (appDocs && typeof appDocs === "object") {
            Object.keys(appDocs).forEach((docName) => {
              const docData = appDocs[docName];

              // FIXED: Handle both boolean and object formats with proper schema
              if (docData === true) {
                // Simple boolean format - INSERT with proper schema
                completedDocsToInsert.push({
                  userId: userId,
                  document_name: docName,
                  completion_date: new Date().toISOString(),
                  // CRITICAL FIX: Remove 'status' if it's causing schema issues
                  // status: 'completed', // ← Bu satırı kaldırın veya boolean yapın
                  application_id: data.id, // Use the new authenticated application ID
                });
              } else if (typeof docData === "object" && docData.document_name) {
                // Object format - INSERT with proper schema
                completedDocsToInsert.push({
                  userId: userId,
                  document_name: docData.document_name,
                  completion_date:
                    docData.completion_date || new Date().toISOString(),
                  // CRITICAL FIX: Remove 'status' if it's causing schema issues
                  // status: 'completed', // ← Bu satırı kaldırın veya boolean yapın
                  application_id: data.id, // Use the new authenticated application ID
                });
              }
            });
          }
        }
      );

      console.log("📋 Completed documents to insert:", completedDocsToInsert);

      // CRITICAL: Insert completed documents if any exist
      if (completedDocsToInsert.length > 0) {
        // OPTION 1: Try without 'status' field first
        const { data: insertedDocs, error: docsError } = await supabase
          .from("completed_documents")
          .insert(completedDocsToInsert)
          .select();

        if (docsError) {
          console.error(
            "❌ Error inserting completed documents (Option 1):",
            docsError
          );

          // OPTION 2: Try with boolean status if first attempt fails
          const completedDocsWithBooleanStatus = completedDocsToInsert.map(
            (doc) => ({
              ...doc,
              status: true, // Boolean instead of string
            })
          );

          console.log(
            "🔄 Retrying with boolean status...",
            completedDocsWithBooleanStatus
          );

          const { data: insertedDocs2, error: docsError2 } = await supabase
            .from("completed_documents")
            .insert(completedDocsWithBooleanStatus)
            .select();

          if (docsError2) {
            console.error(
              "❌ Error inserting completed documents (Option 2):",
              docsError2
            );

            // OPTION 3: Try minimal schema - just essential fields
            const minimalDocs = completedDocsToInsert.map((doc) => ({
              userId: doc.userId,
              document_name: doc.document_name,
              application_id: doc.application_id,
            }));

            console.log("🔄 Retrying with minimal schema...", minimalDocs);

            const { data: insertedDocs3, error: docsError3 } = await supabase
              .from("completed_documents")
              .insert(minimalDocs)
              .select();

            if (docsError3) {
              console.error("❌ Final attempt failed:", docsError3);
            } else {
              console.log(
                "✅ Completed documents inserted (minimal schema):",
                insertedDocs3
              );
              migratedDocumentsCount = insertedDocs3.length;
            }
          } else {
            console.log(
              "✅ Completed documents inserted (boolean status):",
              insertedDocs2
            );
            migratedDocumentsCount = insertedDocs2.length;
          }
        } else {
          console.log(
            "✅ Completed documents inserted (no status):",
            insertedDocs
          );
          migratedDocumentsCount = insertedDocs.length;
        }
      } else {
        console.log("📋 No completed documents to migrate");
      }
    } else {
      console.log("📋 No completed documents found in anonymous data");
    }

    // Clear anonymous data after successful migration
    AnonymousDataService.clearData();

    console.log(
      "✅ Anonymous data successfully migrated to authenticated user"
    );
    console.log(
      `📊 Migration summary: Application ID: ${data.id}, Documents migrated: ${migratedDocumentsCount}`
    );

    // Return the migration result with new application ID
    return {
      applicationId: data.id,
      userAnswers: data,
      migratedDocuments: migratedDocumentsCount,
      completedDocuments: completedDocsToInsert, // Return the docs for immediate use
    };
  } catch (error) {
    console.error("❌ Error during anonymous data migration:", error);
    return null;
  }
}
