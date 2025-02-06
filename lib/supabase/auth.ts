"use server";

import { createClient } from "@/lib/supabase/supabaseServer";

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw error;
  return data.user;
};

export const signUpWithEmail = async (email: string, password: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;
  return data.user;
};

export const signOut = async () => {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
};