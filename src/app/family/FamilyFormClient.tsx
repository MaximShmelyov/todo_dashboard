'use client'

import Form from "next/form";
import {createFamily, updateFamily} from "@/src/db/actions/family";
import Input from "@/src/components/ui/Input";
import {useRouter} from "next/navigation";

export default function FamilyFormClient({family}: { family?: [familyId: string, familyName: string] }) {
  const router = useRouter();
  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center"
      onClick={() => router.back() }
    >
      <div
        className="rounded-xl bg-white shadow-lg p-6"
        onClick={e => e.stopPropagation()}
      >
        <Form
          className="flex flex-col gap-4"
          action={async (formData) => {
            const name = formData.get('familyName').toString();
            if (family) {
              await updateFamily(
                {
                  id: family[0],
                  name,
                }
              );
            } else {
              await createFamily(name);
            }
            router.push('/family');
          }}
        >
          <h3 className="text-lg text-center">{family ? 'Update' : 'Create'}</h3>
          <Input name='familyName' maxLength={25} defaultValue={family ? family[1] : ''} placeholder="Family name" required/>
          <button
            className="rounded-lg border border-stone-100 hover:bg-stone-200"
            type='submit'
          >
            Submit
          </button>
        </Form>
      </div>
    </div>
  );
}