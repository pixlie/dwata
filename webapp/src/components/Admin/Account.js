import { Hx } from "components/LayoutHelpers";

function Account() {
  return (
    <div className="rounded">
      <Hx x="3">Account</Hx>

      <div className="flex flex-row ml-3 mt-3">
        <div className="mr-4">
          <label className="block text-md font-semibold">First name</label>
          <input
            className="block text-xl leading-relaxed border-2 rounded p-1"
            type="text"
          />
        </div>
        <div>
          <label className="block text-md font-semibold">Last name</label>
          <input
            className="block text-xl leading-relaxed border-2 rounded p-1"
            type="text"
          />
        </div>
      </div>

      <div className="ml-3 mt-3">
        <div>
          <label className="block text-md font-semibold">Email</label>
          <input
            className="block text-xl leading-relaxed border-2 rounded p-1"
            disabled
            type="text"
          />
        </div>
      </div>

      <div className="flex flex-row ml-3 mt-3">
        <div className="mr-4">
          <label className="block text-md font-semibold">Title</label>
          <input
            className="block text-xl leading-relaxed border-2 rounded p-1"
            type="text"
          />
        </div>
        <div>
          <label className="block text-md font-semibold">Department</label>
          <input
            className="block text-xl leading-relaxed border-2 rounded p-1"
            type="text"
          />
        </div>
      </div>
    </div>
  );
}

export default Account;
