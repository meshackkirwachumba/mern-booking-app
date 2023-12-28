import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

const MyHotels = () => {
  const { data: hotelData } = useQuery("myHotels", apiClient.fetchMyHotels, {
    onError: () => {},
  });

  if (!hotelData) {
    return <span>No Hotels Found</span>;
  }

  return (
    <div className="space-y-6">
      <span className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link
          className="bg-blue-600 text-white text-xl font bold p-2 hover:bg-blue-500 flex "
          to={"/add-hotel"}
        >
          Add Hotel
        </Link>
      </span>

      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel) => (
          <div className="flex flex-col gap-5 justify-between border border-slate-300 rounded-lg p-8">
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="grid grid-cols-5 gap-5">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>

              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>

              <div className="border border-slate-300 rounded-sm p-3 px-5 flex items-center">
                <BiMoney className="mr-1" />
                <p className="text-sm">{hotel.pricePerNight} p/night</p>
              </div>

              <div className="border border-slate-300 rounded-sm p-3 flex items-center gap-2">
                <BiHotel className="mr-1" />
                <span className="flex flex-col ">
                  <p>{hotel.adultCount} adults</p>{" "}
                  <p>{hotel.childCount} children</p>
                </span>
              </div>

              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1" />
                {hotel.starRating} Star Rating
              </div>
            </div>

            <span className="flex justify-end">
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="bg-blue-600 text-white text-xl font bold p-2 hover:bg-blue-500 flex "
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
