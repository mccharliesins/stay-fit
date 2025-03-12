import supabase from "../utils/supabaseClient";

// User profile operations
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return { data: null, error };
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    return { data: null, error };
  }
};

export const createUserProfile = async (profileData) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([profileData])
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error creating user profile:", error.message);
    return { data: null, error };
  }
};

// Workout operations
export const getWorkouts = async () => {
  try {
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching workouts:", error.message);
    return { data: null, error };
  }
};

export const getUserWorkouts = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching user workouts:", error.message);
    return { data: null, error };
  }
};

export const getWorkoutById = async (workoutId) => {
  try {
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("id", workoutId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching workout:", error.message);
    return { data: null, error };
  }
};

export const createWorkout = async (workoutData) => {
  try {
    const { data, error } = await supabase
      .from("workouts")
      .insert([workoutData])
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error creating workout:", error.message);
    return { data: null, error };
  }
};

export const updateWorkout = async (workoutId, updates) => {
  try {
    const { data, error } = await supabase
      .from("workouts")
      .update(updates)
      .eq("id", workoutId)
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating workout:", error.message);
    return { data: null, error };
  }
};

export const deleteWorkout = async (workoutId) => {
  try {
    const { error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", workoutId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error deleting workout:", error.message);
    return { error };
  }
};
