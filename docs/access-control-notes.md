# Access Control block — design notes

Research behind the `access-control` block's role and permission workflow, and
what was deliberately left out.

## Case studies

| Product                               | Pattern                                                                                                                                                       | Source                                                                                                                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub (custom repository roles)      | A new role starts by choosing a role to inherit; you then add permissions on top. Permissions already covered by the base role can't be added again.          | [GitHub Docs](https://docs.github.com/enterprise-cloud@latest/organizations/managing-peoples-access-to-your-organization-with-roles/managing-custom-repository-roles-for-an-organization) |
| Zendesk (custom roles)                | Clone any role from its row menu, then rename and adjust. Ships predefined system roles you use as-is or clone. Offers a side-by-side role comparison matrix. | [Managing custom roles](https://support.zendesk.com/hc/en-us/articles/4408832292506-Managing-custom-roles)                                                                                |
| Confluence Cloud (custom space roles) | Enforces permission dependencies: View is mandatory, and removing Edit also removes Create and Delete. Changes apply when saved.                              | [Create and manage custom roles](https://support.atlassian.com/confluence-cloud/docs/create-and-manage-custom-roles/)                                                                     |
| Stripe, Linear                        | Fixed built-in roles only, with no custom roles. A reminder that most teams only need a few roles, so templates matter more than a blank editor.              | [Stripe blog](https://stripe.com/blog/new-roles-and-permissions-in-the-dashboard), [Linear docs](https://linear.app/docs/members-roles)                                                   |
| Oso (RBAC best practices)             | Prefer templates and inheritance over one-off roles to avoid role explosion. Use a role–resource–action matrix as the configuration and audit surface.        | [10 RBAC best practices](https://www.osohq.com/learn/rbac-best-practices)                                                                                                                 |

## Decisions in the block

- **Start from a role.** The Add role dialog copies an existing role's
  permissions (GitHub, Zendesk). It defaults to the least-privileged built-in
  role, and "No access" is still available.
- **Duplicate** is in every role's menu, and on the locked Owner notice.
- **View is a dependency.** Granting create/edit/delete grants view, and revoking
  view clears the row (Confluence). The rule lives in `setAction()` in
  `data.ts`, so bulk toggles follow it too.
- **Bulk toggles.** Column checkboxes grant or revoke an action on every
  resource. Row "All" checkboxes do the same for every action on one resource.
  A partial state shows a dash.
- **Staged changes.** Edits collect in a draft. A save bar shows the change
  count, the roles touched, and how many members are affected, with Save and
  Discard. New roles are created saved, with their copied permissions.
- **Built-in vs custom.** Built-in roles can be edited but not deleted. Owner is
  locked so a workspace can't lose full access.

## Not built (candidates for later)

- Side-by-side role comparison (Zendesk).
- Per-permission descriptions or tooltips for less obvious grants.
- Audit trail of permission changes. The `audit-log` block covers the display
  side.
- Assigning members to a role from this screen.
