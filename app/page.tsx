import { PrimaryButton } from "@/app/components/PrimaryButton";
import { SecondaryButton } from "@/app/components/SecondaryButton";
import { TertiaryButton } from "@/app/components/TertiaryButton";
import { TextInput } from "@/app/components/TextInput";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

export default function Home() {
  return (
    <div className="container mx-auto px-2 ">
      <p className="font-newake">Newake</p>
      <p className="font-geist">Geist</p>

      <div className="flex gap-1 items-center justify-end">
        <TertiaryButton>Indices</TertiaryButton>
        <SecondaryButton>Indices</SecondaryButton>
      </div>
      <div className="mt-2 flex gap-1 items-center">
        <TextInput className="w-full" placeholder="Text" />
        <PrimaryButton>
          <ArrowRightIcon className="size-6" />
        </PrimaryButton>
      </div>
    </div>
  );
}
