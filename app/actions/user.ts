"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Use admin client for deletion
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // 1. Delete email accounts (cascades to emails)
    const { error: accountsError } = await supabaseAdmin
      .from("email_accounts")
      .delete()
      .eq("user_id", user.id)

    if (accountsError) throw accountsError

    // 2. Delete public user data
    const { error: userError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", user.id)

    if (userError) throw userError

    // 3. Delete auth user
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (authError) throw authError

  } catch (error) {
    console.error("Error deleting account:", error)
    throw new Error("Failed to delete account")
  }

  redirect("/")
}
