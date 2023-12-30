import { FormProvider, useForm } from "react-hook-form";
import HotelDetailsSection from "./HotelDetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  adultCount: number;
  childCount: number;
};

interface ManageHotelFormProps {
  hotel?: HotelType;
  onSave: (data: FormData) => void;
  isLoading: boolean;
}
const ManageHotelForm = ({
  onSave,
  isLoading,
  hotel,
}: ManageHotelFormProps) => {
  const formMethods = useForm<HotelFormData>();

  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]);

  function submitFormData(data: HotelFormData) {
    const formData = new FormData();

    if (hotel) {
      formData.append("hotelId", hotel._id);
    }
    formData.append("name", data.name);
    formData.append("city", data.city);
    formData.append("country", data.country);
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("pricePerNight", data.pricePerNight.toString());
    formData.append("starRating", data.starRating.toString());
    formData.append("adultCount", data.adultCount.toString());
    formData.append("childCount", data.childCount.toString());

    data.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    if (data.imageUrls) {
      data.imageUrls.forEach((imageUrl, index) => {
        formData.append(`imageUrls[${index}]`, imageUrl);
      });
    }

    Array.from(data.imageFiles).forEach((imagefile) => {
      formData.append(`imageFiles`, imagefile);
    });

    // save form data
    onSave(formData);
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(submitFormData)}
        className="flex flex-col gap-8"
      >
        <HotelDetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />

        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 font-bold hover:bg-blue-500 text-xl disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
