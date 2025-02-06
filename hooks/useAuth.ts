// import { createClient } from "@/lib/supabase/supabaseClient";
// import { useEffect, useState } from "react";

// const supabase = await createClient()

// export const useAuth = () => {
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const getUser = async () => {
//       const { data: { session } } = await supabase.auth.getSession();

//       setUser(session?.user || null);
//     };

//     getUser();

//     const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user || null);
//     });

//     return () => authListener?.subscription.unsubscribe();
//   }, []);

//   return { user };
// };