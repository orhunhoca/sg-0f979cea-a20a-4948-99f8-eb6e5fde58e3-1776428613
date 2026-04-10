import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { number, email } = req.query;

  if (!number || !email || typeof number !== "string" || typeof email !== "string") {
    return res.status(400).json({ valid: false, message: "Geçersiz parametreler" });
  }

  try {
    const { data, error } = await supabase
      .from("membership_numbers")
      .select("full_name, is_used")
      .eq("membership_number", number)
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(200).json({ 
        valid: false, 
        message: "Üyelik numarası veya e-posta eşleşmiyor" 
      });
    }

    if (data.is_used) {
      return res.status(200).json({ 
        valid: false, 
        message: "Bu üyelik numarası zaten kullanılmış" 
      });
    }

    return res.status(200).json({ 
      valid: true, 
      fullName: data.full_name 
    });
  } catch (error) {
    console.error("Membership validation error:", error);
    return res.status(500).json({ 
      valid: false, 
      message: "Sunucu hatası" 
    });
  }
}