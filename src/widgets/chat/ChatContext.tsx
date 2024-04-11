import { Component, For } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";
import { useWorkspace } from "../../stores/workspace";

interface IPropTypes {
  chatContext: string;
}

const ChatContext: Component<IPropTypes> = (props) => {
  const [_, { getColors }] = useUserInterface();
  const [workspace] = useWorkspace();

  // A modal window placed in the center on the parent
  return (
    <div
      class="w-full rounded-md my-2 border"
      style={{
        color: getColors().colors["editor.foreground"],
        "border-color": getColors().colors["editorWidget.border"],
      }}
    >
      <label class="block text-sm font-medium leading-6 py-2 pl-4">
        Chat context
      </label>
      <div
        class="px-4 max-h-24 overflow-hidden mb-4"
        style={{
          color: getColors().colors["editor.foreground"],
        }}
      >
        We are using PostgreSQL and this is the database structure: -
        alembic_version table with columns: (version_num) - attendee table with
        columns: (id, event_id, user_id, is_creator, is_organizer, is_optional,
        response_status, created_at, responded_at, contact_id,
        synced_event_provider_id) - calendar table with columns: (id, family_id,
        user_id, name, description, timezone, provider, provider_calendar_id,
        is_used_in_hearth, include_event_details, created_at, user_contact_id,
        is_hearth_sync_calendar, color) - calendar_account table with columns:
        (id, family_id, account, user_id) - device table with columns: (id,
        device_id, lat, long, timezone, created_at, family_id,
        current_native_app_version, current_android_version,
        is_checking_first_boot) - event table with columns: (id, icaluid,
        family_id, calendar_id, subject, description, start_at, start_timezone,
        end_at, end_timezone, created_at, created_by, is_all_day_event,
        provider_id, color) - external_event table with columns: (id, icaluid,
        event_provider_id, family_id, calendar_id, subject, description,
        is_all_day_event, start_at, start_timezone, end_at, end_timezone,
        recurrence_rules) - external_event_attendee table with columns: (id,
        external_event_id, user_id, contact_id, is_creator, is_organizer,
        is_optional, response_status, created_at, responded_at) - family table
        with columns: (id, name, is_onboarded, created_at) - family_member table
        with columns: (id, family_id, user_id, is_responsible_adult, joined_at)
        - invitation table with columns: (id, contact_type, value, code,
        invited_by_user_id, invited_to_family_id, created_at) - onboarding table
        with columns: (id, created_by, family_id, created_at, completed_at,
        device_id) - one_time_password table with columns: (id, contact_id,
        code, created_at) - recurrence_rule table with columns: (id, freq,
        dt_start, interval, until, count, by_day, by_month_day,
        completion_streak) - software_update_group table with columns: (id,
        code_name, current_native_app_version, current_android_version,
        created_at, created_by) - software_update_group_device table with
        columns: (id, update_group_id, device_id, added_by, added_at) -
        software_update_log table with columns: (id, update_group_id, device_id,
        update_group_log_id, requested_native_app_version,
        requested_android_version, current_status, created_by, created_at,
        completed_at, is_processing_update, uni_target_and_software_version,
        md5sum) - task table with columns: (id, family_id, subject, description,
        is_priority, completed_at, created_at, created_by, start_at,
        recurrence_rule_id, due_at, next_instance_start_at) - task_assignee
        table with columns: (id, task_id, user_id, created_at) - upload table
        with columns: (id, name, original_name, extension, content_type,
        is_saved_to_cloud, is_processed, created_at) - user table with columns:
        (id, first_name, last_name, is_staff, avatar_file_name,
        avatar_upload_id, created_at) - user_authentication table with columns:
        (id, user_id, provider, identity, access_token, refresh_token,
        contact_id, password) - user_contact table with columns: (id, user_id,
        contact_type, value, is_verified, created_at)
      </div>

      <For each={workspace.dataSourceList}>
        {(ds) => (
          <div
            class="p-2 px-4 cursor-pointer rounded-md rounded-t-none border-t"
            style={{
              color: getColors().colors["editor.foreground"],
              "background-color": getColors().colors["editorWidget.background"],
              "border-color": getColors().colors["editorWidget.border"],
            }}
          >
            <i class="w-6 fa-solid fa-database" />
            {ds.sourceName}

            <p class="text-sm">Structure of all tables</p>
          </div>
        )}
      </For>
    </div>
  );
};

export default ChatContext;
