import { Button } from "components/LayoutHelpers";

export default () => {
  return (
    <div className="flex items-center">
      <div className="block lg:inline-block items-center flex-grow"></div>

      <div className="block lg:inline-block items-center">
        <Button theme="secondary" linkTo="/manage/">
          Manage
        </Button>
      </div>
    </div>
  );
};
