export interface LandmarkInfo {
  image: string;
  name: string;
  zh: string;
  desc: string;
  location: string;
}

export const LEVEL_LANDMARKS: Record<string, LandmarkInfo> = {
  L0: {
    image: "/images/jiufen-teahouse.jpg",
    name: "Jiufen Old Street",
    zh: "九份老街",
    desc: "Nuansa lentera merah & teh tradisional Formosa",
    location: "New Taipei City",
  },
  L1: {
    image: "/images/chiang-kai-shek.jpg",
    name: "Liberty Square & Memorial Hall",
    zh: "中正紀念堂",
    desc: "Gerbang megah & pusat sejarah kebudayaan Taipei",
    location: "Taipei",
  },
  L2: {
    image: "/images/sun-moon-lake.jpg",
    name: "Sun Moon Lake",
    zh: "日月潭",
    desc: "Danau alami nan permai di jantung pulau Taiwan",
    location: "Nantou",
  },
  L3: {
    image: "/images/kaohsiung-city.jpg",
    name: "Kaohsiung Harbour Skyline",
    zh: "高雄港天際線",
    desc: "Kota pelabuhan modern & semarak di selatan Taiwan",
    location: "Kaohsiung",
  },
  L4: {
    image: "/images/taroko-gorge.jpg",
    name: "Taroko Gorge National Park",
    zh: "太魯閣國家公園",
    desc: "Ngarai marmer megah & keindahan alam Hualien",
    location: "Hualien",
  },
  L5: {
    image: "/images/taipei-101.jpg",
    name: "Taipei 101 Skyline",
    zh: "臺北101天際線",
    desc: "Puncak cakrawala modern & kelancaran profesional",
    location: "Taipei",
  },
};
