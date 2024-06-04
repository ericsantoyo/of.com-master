// import React from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Card } from '@/components/ui/card';

// const PlayerCard = ({ player, style }: { player: players; style?: any }) => {
//   const { playerData } = player;

//   return (
//     <div className="player flex flex-col items-center justify-center" style={{ position: 'absolute', ...style }}>
//       <div className="image-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
//         <Link href={`/player/${playerData.playerID}`}>
//           <a>
//             <Image
//               src={playerData.image}
//               alt={playerData.name}
//               width={84}
//               height={84}
//               priority
//             />
//           </a>
//         </Link>
//       </div>
//       <Link href={`/player/${playerData.playerID}`}>
//         <a>
//           <Card className="font-semibold text-center min-w-[72px] px-2 border-none rounded-xs text-base shadow-md shadow-neutral-800 text-neutral-800 backdrop-blur-xl bg-white/50 whitespace-nowrap">
//             {playerData.nickname.split(' ').slice(-1).join(' ')}
//           </Card>
//         </a>
//       </Link>
//       <p className="text-center text-xs">{playerData.position}</p>
//       <p className="text-center text-xs">{playerData.points}</p>
//     </div>
//   );
// };

// export default PlayerCard;
