<![CDATA[
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "
...
      .eq("id", requestId)
      .single();

    return { data, error };
  },
};
]]>

[Tool result trimmed: kept first 100 chars and last 100 chars of 4267 chars.]