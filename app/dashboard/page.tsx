// "use client"

// import { useEffect, useState } from "react";/
// import { StreamView } from "../components/StreamView";
// import axios from "axios";

// export default function Dashboard() {
//   const [creatorId, setCreatorId] = useState("");

//   useEffect(() => {
//     axios.get("/api/streams/space").then(res => {
//       setCreatorId(res.data.creatorId);
      
//     })
//   }, []);
//     useEffect(() => {
//       console.log(creatorId);
//     }, [creatorId]);

//   return (
//     <div>
//       {creatorId ? <StreamView creatorId={creatorId} /> : <p>Loading...</p>}
//     </div>
//   );
// }
