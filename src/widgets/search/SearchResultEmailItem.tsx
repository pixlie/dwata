import { Component } from "solid-js";
import { Email } from "../../api_types/Email";
import { useUserInterface } from "../../stores/userInterface";

const SearchResultEmailItem: Component<Email> = (props) => {
  const [_, { getColors }] = useUserInterface();
  return (
    <div
      class="border rounded-md my-2"
      style={{
        "border-color": getColors().colors["editorWidget.border"],
      }}
    >
      <div
        class="flex gap-8 py-2 pr-3"
        style={{
          color: getColors().colors["editor.foreground"],
        }}
      >
        <div
          class="border rounded px-1 self-center"
          style={{
            "border-color": getColors().colors["editorWidget.border"],
            "background-color": getColors().colors["editorWidget.background"],
          }}
        >
          Mitesh Ashar
        </div>
        <div class="text-lg font-semibold">{props.subject}</div>
      </div>

      <div
        class="font-thin pl-8 pr-4"
        style={{
          color: getColors().colors["editor.foreground"],
        }}
      >
        Eum corporis placeat aspernatur. Cupiditate minus blanditiis unde neque
        aut sequi. Necessitatibus molestiae rerum aliquid quia. Vero enim
        laudantium nihil est quia. Possimus possimus iste quis qui ex aut quo.
        Sit facere dolor a quis. Aliquid quidem totam esse. Ipsum voluptatibus
        quia consequatur accusantium. Rerum vitae adipisci minima ullam.
        Assumenda tenetur maxime veritatis et fugiat doloribus sequi. Illo ut ad
        a sapiente voluptatem accusamus itaque non. Sint qui omnis et
        consequatur quas illo quo. Non aut aut quis. Laudantium laboriosam amet
        architecto dolores nulla nesciunt. Quia incidunt temporibus consequatur.
        Culpa laudantium omnis quo impedit rerum voluptas voluptatem. Qui
        laboriosam nihil corrupti odio. In consequatur quis sapiente enim sed
        magnam ut.
      </div>

      <div
        class="mt-1 border-t font-thin text-sm px-4 py-1 flex gap-4"
        style={{
          "border-color": getColors().colors["editorWidget.border"],
          color: getColors().colors["editor.foreground"],
        }}
      >
        <span class="grow" />
        <span class="py-0.5">Date: 6 Aug 2024</span>
      </div>
    </div>
  );
};

export default SearchResultEmailItem;
