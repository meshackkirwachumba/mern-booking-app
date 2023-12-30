import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelFormData>();

  const existingImagesUrls = watch("imageUrls");

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string
  ) => {
    event.preventDefault();
    setValue(
      "imageUrls",
      existingImagesUrls.filter((url) => url !== imageUrl)
    );
  };
  return (
    <div>
      <h2 className="text-2xl font-bold my-3">Add A Maximum of 6 Images</h2>
      <div className="flex flex-col gap-4 border rounded p-4">
        {existingImagesUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImagesUrls.map((url, index) => (
              <div className="relative group ">
                <img
                  key={index}
                  src={url}
                  alt="hotel"
                  className="min-h-full object-cover"
                />
                <button
                  onClick={(event) => handleDelete(event, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 text-white font-bold group-hover:opacity-100"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength =
                imageFiles.length + (existingImagesUrls?.length || 0);

              if (totalLength === 0) {
                return "Please add at least one image";
              }

              if (totalLength > 6) {
                return "Please add at most 6 images";
              }

              return true;
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 font-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default ImagesSection;
