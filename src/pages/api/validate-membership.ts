import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ valid: false, message: "Method not allowed" });
  }

  const numberParam = req.query.number;
  const emailParam = req.query.email;

  const number = Array.isArray(numberParam) ? numberParam[0] : numberParam;
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam;

  if (!number || !email) {
    return res.status(400).json({ 
      valid: false, 
      message: "Üyelik numarası ve e-posta gerekli" 
    });
  }

  try {
    const { data, error } = await supabase
      .from("membership_numbers")
      .select("*")
      .eq("membership_number", number)
      .eq("email", email)
      .maybeSingle();

    console.log("Validation check:", { number, email, data, error });

    if (error) {
      console.error("Validation error:", error);
      return res.status(500).json({ 
        valid: false, 
        message: "Sunucu hatası" 
      });
    }

    if (!data) {
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
    console.error("Unexpected error:", error);
    return res.status(500).json({ 
      valid: false, 
      message: "Sunucu hatası" 
    });
  }
}