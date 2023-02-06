import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { EulogyInfo } from "../api/graveyard";

export default function LilPage() {
  const router = useRouter();
  const { uid } = router.query;
  const [eulogy, setEulogy] = useState<EulogyInfo[]>([]);
  useEffect(() => {
    async function getEulogies() {
      const res = await fetch(`/api/graveyard/${uid}`);
      if (res.ok) {
        const data = await res.json();
        console.info(data, "set data");
        setEulogy(data);
      }
    }
    getEulogies();
  }, [uid]);
  return <p>lilpage</p>;
}
