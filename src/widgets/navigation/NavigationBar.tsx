import { Component, createSignal } from "solid-js";

import NavigationButtom from "./NavigationButton";
import DropdownItem from "../interactable/DropdownItem";

const NavigationBar: Component = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] =
    createSignal<boolean>(false);

  const handleUserDropdownClick = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen());
  };

  return (
    <nav class="fixed w-full bg-gray-800 px-8">
      <div class="relative flex h-12 items-center justify-between">
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <a href="/">
              <img
                class="h-6 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
            </a>
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-2">
              {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
              {/* <NavigationButtom label="Organisations" path="/apps" /> */}
              {/* <NavigationButtom label="Tasks" path="/settings" /> */}
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <NavigationButtom label="Focus: #product" path="/labs" />
          {/* <NavigationButtom label="Global filter: Jan 2024" path="/labs" /> */}
          <button
            type="button"
            class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span class="absolute -inset-1.5"></span>
            <span class="sr-only">View notifications</span>
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </button>

          {/* <!-- Profile dropdown --> */}
          <div class="relative ml-3">
            <div>
              <button
                type="button"
                class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
                onClick={handleUserDropdownClick}
              >
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">Open user menu</span>
                <img
                  class="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </button>
            </div>

            {!!isUserDropdownOpen() && (
              <div
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
                {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                <DropdownItem label="Your Account" path="/user" />
                <DropdownItem label="Switch Organization" />
                {/* <DropdownItem label="Settings" /> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
