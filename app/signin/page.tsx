"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setIsLoading(true);
    setError("");

    // Check if user exists in Supabase
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!existingUser) {
      // Create new user
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ email, plan: "free", generations_used: 0 }]);

      if (insertError) {
        setError("Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }
    }

    // Save to localStorage so we know who's logged in
    localStorage.setItem("copyai_user", email);
    router.push("/");
  };