import { mockData } from "./dataMock";

export const fetchData = async () => {
  try {
    // Directly use mockData array without fetching
    const data = mockData;
    const pictures = data.map((item) => {
      return { url: item.picture, width: item.width, height: item.height, id: item.id, nftName: item.nftName, nftLink: item.nftLink, artist: item.artist };
    });

    // console.log(pictures);
    return pictures;
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};
