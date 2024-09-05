import { Component } from "solid-js";
import Search from "../search/Search";

const TopNavigationBar: Component = () => {
  return (
    <div class="lg:pl-20">
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        {/*  Separator */}
        <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true"></div>

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <Search />
        </div>
      </div>
    </div>
  );
};

export default TopNavigationBar;
