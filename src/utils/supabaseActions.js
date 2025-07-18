// utils/supabaseActions.js - Updated to handle anonymous users
import supabase from "../services/supabase";
import { AnonymousDataService } from "./anonymousDataService";

// Helper to detect if user is anonymous
function isAnonymousUser(userId) {
  return userId === 'anonymous' || AnonymousDataService.isAnonymousUser();
}

export async function completeDocument(userId, documentName, applicationId) {
  // Handle anonymous users
  if (isAnonymousUser(userId)) {
    return AnonymousDataService.completeDocument(documentName, applicationId);
  }

  // Handle authenticated users
  const { data, error } = await supabase.from("completed_documents").insert([
    {
      userId,
      document_name: documentName,
      completion_date: new Date(),
      status: true,
      application_id: applicationId,
    },
  ]);

  if (error) {
    console.error("Error completing document:", error);
    return { error };
  }

  return { data };
}

export async function fetchCompletedDocuments(userId, applicationId) {
  // Handle anonymous users
  if (isAnonymousUser(userId)) {
    return AnonymousDataService.fetchCompletedDocuments(applicationId);
  }

  // Handle authenticated users
  const { data, error } = await supabase
    .from("completed_documents")
    .select("*")
    .eq("userId", userId)
    .eq("application_id", applicationId);

  if (error) {
    console.error("Error fetching completed documents:", error);
    return { error };
  }

  return data;
}

export async function uncompleteDocument(userId, documentName, applicationId) {
  // Handle anonymous users
  if (isAnonymousUser(userId)) {
    return AnonymousDataService.uncompleteDocument(documentName, applicationId);
  }

  // Handle authenticated users
  const { data, error } = await supabase
    .from("completed_documents")
    .delete()
    .match({
      userId,
      document_name: documentName,
      application_id: applicationId,
    });

  if (error) {
    console.error("Error uncompleting document:", error);
    return { error };
  }

  return { data };
}