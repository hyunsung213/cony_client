// "use client";

// import { bgColor, fontColor } from "@/styles/color";
// import { getLevelFromRate, LevelRanges } from "@/utils/interface/rate";
// import { UserDetail } from "@/utils/interface/user";
// import {
//   PieChart,
//   Pie,
//   Tooltip,
//   Legend,
//   Cell,
//   ResponsiveContainer,
// } from "recharts";

// export default function RateCard({ users }: { users: UserDetail[] }) {
//   const countUsersByLevel = (users: UserDetail[]) => {
//     const counts: Record<string, number> = {};
//     for (const user of users) {
//       const level = getLevelFromRate(user.Rate?.rateValue ?? 0);
//       counts[level] = (counts[level] || 0) + 1;
//     }
//     return counts;
//   };

//   const generatePieDataFromUsers = (users: UserDetail[]) => {
//     const levelCounts = countUsersByLevel(users);
//     return LevelRanges.map(({ level }) => ({
//       name: level,
//       value: levelCounts[level] || 0,
//     }));
//   };

//   const pieData = generatePieDataFromUsers(users);
//   const totalUsers = users.length || 0;

//   const COLORS = [
//     "#8884d8",
//     "#82ca9d",
//     "#ffc658",
//     "#ff7f50",
//     "#8dd1e1",
//     "#a4de6c",
//     "#d0ed57",
//   ];

//   return (
//     <div className="w-full pt-6 space-y-4 sm:space-y-6">
//       {/* ✅ 예쁜 배너 */}
//       <div className="flex justify-center">
//         <span
//           className={`px-4 py-1 text-sm font-semibold rounded-full sm:text-base ${bgColor.skyblue} ${fontColor.blue}`}
//         >
//           현재 신청 인원:{" "}
//           <span className={`font-bold ${fontColor.deepOrange}`}>
//             {totalUsers}
//           </span>
//           명
//         </span>
//       </div>

//       {/* ✅ 고정 높이 차트 or 안내문구 */}
//       <div className="w-full h-[320px] sm:h-[380px]">
//         {totalUsers === 0 ? (
//           <div className="flex items-center justify-center h-full text-sm font-medium text-gray-500 sm:text-base">
//             참여 인원이 없습니다.
//           </div>
//         ) : (
//           <ResponsiveContainer>
//             <PieChart>
//               <Legend
//                 verticalAlign="top"
//                 align="center"
//                 layout="horizontal"
//                 iconSize={10}
//                 wrapperStyle={{ fontSize: "15px", marginBottom: "8px" }}
//               />
//               <Pie
//                 data={pieData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 innerRadius={60}
//                 isAnimationActive={false}
//                 className="pointer-events-none"
//                 label={({ name, percent, value }) => {
//                   if (
//                     value !== undefined &&
//                     percent !== undefined &&
//                     value > 0
//                   ) {
//                     return `${name} ${(percent * 100).toFixed(0)}%`;
//                   }
//                   return "";
//                 }}
//                 labelLine={false}
//               >
//                 {pieData.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(value: number) => `${value}명`} />
//             </PieChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </div>
//   );
// }
