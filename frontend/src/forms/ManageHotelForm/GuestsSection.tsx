import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const GuestsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Add Guests</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6 bg-gray-300">
        <label className="text-gray-700 text-sm font-bold ">
          Adults
          <input
            type="number"
            min={1}
            className="border rounded w-full py-1.5 px-2 font-normal"
            {...register("adultCount", { required: "This field is required" })}
          />
          {errors.adultCount && (
            <span className="text-red-500">{errors.adultCount.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold ">
          Children
          <input
            type="number"
            min={0}
            className="border rounded w-full py-2 px-3 font-normal"
            {...register("childCount", { required: "This field is required" })}
          />
          {errors.childCount && (
            <span className="text-red-500">{errors.childCount.message}</span>
          )}
        </label>
      </div>
    </div>
  );
};

export default GuestsSection;
