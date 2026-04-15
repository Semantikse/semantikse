import { PrimaryButton } from "@/app/components/PrimaryButton";
import { SecondaryButton } from "@/app/components/SecondaryButton";
import { TertiaryButton } from "@/app/components/TertiaryButton";
import { TextInput } from "@/app/components/TextInput";
import { ArrowRightIcon, StarIcon } from "@heroicons/react/20/solid";

export default function Home() {
  return (
    <div className="container mx-auto px-2 ">
      <p className="font-newake">Newake</p>
      <p className="font-geist">Geist</p>

      <div className="flex flex-col gap-2">
        <div className="ms-auto w-fit relative grid grid-cols-2">
          <TertiaryButton className="shadow-md absolute inset-0">
            300
            <StarIcon className="size-4 mb-0.5" />
          </TertiaryButton>
          <SecondaryButton className="w-max col-start-2 col-end-2">
            Indices
          </SecondaryButton>
        </div>
        <div className="flex gap-1 items-center">
          <TextInput className="w-full" placeholder="Text" />
          <PrimaryButton>
            <ArrowRightIcon className="size-6" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
