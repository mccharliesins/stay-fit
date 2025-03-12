import supabase from "../utils/supabaseClient";

// Check if required tables exist
export const checkDatabaseSetup = async () => {
  try {
    console.log("Checking database setup...");

    // Check if profiles table exists
    const { error: profilesError } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    // Check if workouts table exists
    const { error: workoutsError } = await supabase
      .from("workouts")
      .select("id")
      .limit(1);

    const profilesExists =
      !profilesError || !profilesError.message.includes("does not exist");
    const workoutsExists =
      !workoutsError || !workoutsError.message.includes("does not exist");

    console.log("Database check results:", {
      profilesExists,
      workoutsExists,
      profilesError: profilesError?.message,
      workoutsError: workoutsError?.message,
    });

    return {
      profilesExists,
      workoutsExists,
      error: null,
    };
  } catch (error) {
    console.error("Error checking database setup:", error.message);
    return {
      profilesExists: false,
      workoutsExists: false,
      error,
    };
  }
};

// User profile operations
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      // If the error is that the profile doesn't exist, try to create it
      if (error.message.includes("does not exist")) {
        console.log(
          "Profiles table does not exist. Please set up your database."
        );
        return { data: null, error };
      }

      // If no match was found, create a default profile
      if (error.code === "PGRST116") {
        console.log(
          "Profile not found, creating default profile for user:",
          userId
        );

        // Get user data from auth
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("Error getting user data:", userError.message);
          throw userError;
        }

        // Create a default profile
        const defaultProfile = {
          id: userId,
          name: userData.user?.user_metadata?.name || "User",
          email: userData.user?.email,
          created_at: new Date().toISOString(),
        };

        const { data: newProfile, error: createError } =
          await createUserProfile(defaultProfile);

        if (createError) throw createError;

        return { data: newProfile, error: null };
      }

      throw error;
    }

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
