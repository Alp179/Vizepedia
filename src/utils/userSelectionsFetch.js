import supabase from "../services/supabase";

export async function fetchUserSelectionsNav(userId) {
  const { data, error } = await supabase
    .from("userAnswers")
    .select(
      "id, created_at, ans_country, ans_purpose, ans_profession, ans_vehicle, ans_kid, ans_accommodation, ans_hassponsor, ans_sponsor_profession, has_appointment, has_filled_form"
    )
    .eq("userId", userId);

  if (error) {
    console.error("Error fetching user selections:", error);
    return [];
  }

  return data.map((item) => ({
    ...item,
    created_at: item.created_at
      ? new Date(item.created_at).toISOString()
      : null,
  }));
}

export async function fetchUserSelectionsDash(userId, applicationId) {
  const { data, error } = await supabase
    .from("userAnswers")
    .select(
      "id, created_at, ans_country, ans_purpose, ans_profession, ans_vehicle, ans_kid, ans_accommodation, ans_hassponsor, ans_sponsor_profession, has_appointment, has_filled_form"
    )
    .eq("userId", userId)
    .eq("id", applicationId);

  if (error) {
    console.error("Error fetching user selections:", error);
    return [];
  }

  return data.map((item) => ({
    ...item,
    created_at: item.created_at
      ? new Date(item.created_at).toISOString()
      : null,
  }));
}

export async function fetchLatestApplication(userId) {
  const { data, error } = await supabase
    .from("userAnswers")
    .select(
      "id, created_at, ans_country, ans_purpose, ans_profession, ans_vehicle, ans_kid, ans_accommodation, ans_hassponsor, ans_sponsor_profession, has_appointment, has_filled_form"
    )
    .eq("userId", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching latest application:", error);
    return null;
  }

  return data.length > 0
    ? {
        ...data[0],
        created_at: data[0].created_at
          ? new Date(data[0].created_at).toISOString()
          : null,
      }
    : null;
}
