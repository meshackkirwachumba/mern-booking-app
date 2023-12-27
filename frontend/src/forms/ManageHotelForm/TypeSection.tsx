import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import { hotelTypes } from "../../config/hotel-options-config";

const TypeSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  const typeWatch = watch("type");
  return (
    <div>
      <h2 className="text-2xl font-bold my-3">Type</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        {hotelTypes.map((type) => (
          <label
            className={
              typeWatch === type
                ? "cursor-pointer bg-blue-300 text-sm rounded-full py-2 px-4 font-semibold"
                : "cursor-pointer bg-gray-300 text-sm rounded-full py-2 px-4 font-semibold"
            }
          >
            <input
              type="radio"
              value={type}
              {...register("type", { required: "Type is required" })}
              className="hidden"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
      {errors.type && (
        <span className="text-red-500">{errors.type.message}</span>
      )}
    </div>
  );
};

export default TypeSection;
