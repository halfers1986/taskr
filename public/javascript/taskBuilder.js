function taskBuilder(task) {
    var taskID=task.task_id;
    var taskTitle=task.task_title;
    var taskDescription=task.task_description;
    var taskDueDate=task.task_due_date;
    var taskDueDateFormatted=task.task_due_date_formatted;
    var taskPriority=task.task_priority_id;
    var taskTypeID=task.task_type_id;
    var subtasks=task.subtasks;
    var listItems=task.listItems;
    var taskComplete=task.task_complete;
    var taskCreatedTimestamp=task.task_created_timestamp;
    var taskUpdatedTimestamp=task.task_updated_timestamp;
    var taskCompletedTimestamp=task.task_completed_timestamp;
    if (taskComplete) { 
        var articleClass="task completed"
    } else {
        var articleClass="task"
    }
    let taskHTML = `
        <article class="${articleClass}" data-task-id="${taskID}" data-task-type="${taskTypeID}" data-task-created="${taskCreatedTimestamp}" data-task-updated="${taskUpdatedTimestamp}" data-task-completed-timestamp="${taskCompletedTimestamp}" data-task-complete="${taskComplete}">
        <div class="tile-header">
            <div style="display: flex; align-items: center; max-width: 50%;">
              <div style="padding-bottom: 1rem; margin-left: 0; margin-right: 0.5rem">
                <% if (taskTypeID===1) { %>
                <svg class="tile-icon" style="margin-left: -0.25rem" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="14 20.18 10.41 16.59 9 18 14 23 23 14 21.59 12.58 14 20.18" fill-rule="evenodd" />
                  <path d="M25,5H22V4a2,2,0,0,0-2-2H12a2,2,0,0,0-2,2V5H7A2,2,0,0,0,5,7V28a2,2,0,0,0,2,2H25a2,2,0,0,0,2-2V7A2,2,0,0,0,25,5ZM12,4h8V8H12ZM25,28H7V7h3v3H22V7h3Z" transform="translate(0 0)" />
                </svg>
                <% } else if (taskTypeID===2) { %>
                <svg class="tile-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 6L21 6.00078M8 12L21 12.0008M8 18L21 18.0007M3 6.5H4V5.5H3V6.5ZM3 12.5H4V11.5H3V12.5ZM3 18.5H4V17.5H3V18.5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <% } else if (taskTypeID===3) { %>
                <svg class="tile-icon" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                  <path d="m1783.68 1468.235-315.445 315.445v-315.445h315.445Zm-541.327-338.823v112.94h-903.53v-112.94h903.53Zm338.936-338.824V903.53H338.824V790.59h1242.465ZM621.176 0c93.403 0 169.412 76.01 169.412 169.412 0 26.09-6.437 50.484-16.94 72.62L999.98 468.255l-79.962 79.962-226.221-226.334c-22.137 10.504-46.532 16.942-72.622 16.942-93.402 0-169.411-76.01-169.411-169.412C451.765 76.009 527.775 0 621.176 0Zm395.295 225.882v112.942h790.588v1016.47h-451.765v451.765H112.941V338.824h225.883V225.882H0V1920h1421.478c45.176 0 87.755-17.619 119.717-49.581l329.224-329.11c31.962-32.076 49.581-74.655 49.581-119.831V225.882h-903.53Z" fill-rule="evenodd"></path>
                </svg>
                <% } %>
              </div>
              <h2 class="task-title"><%= taskTitle %></h2>
            </div>
            <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between">
              <h4 class="task-priority" data-task-priority="<%= taskPriority %>" style="margin-right: 1rem;">
                <% if (taskPriority !== null) { %>
                <u>Priority:</u> <% if (taskPriority===1) { %>Low<% } else if (taskPriority===2) { %>Medium<% } else if (taskPriority===3) { %>High<% } %>
                <% } %>
              </h4>
              <h4 class="task-due-date" data-date="<%= taskDueDate ? new Date(taskDueDate).toISOString().split('T')[0] : '' %>">
                <% if (taskTypeID===1 || taskTypeID===3) { %>
                <% if (taskDueDateFormatted !== null) { %>
                <u>Due:</u> <%= taskDueDateFormatted %> <% } %>
                <% } %>
              </h4>
            </div>
          </div>
          <% if (taskTypeID===1 || taskTypeID===3) { %>
          <p class="task-description" style="white-space: pre-wrap;"><%= task.task_description %></p>
          <% } %> <% if (taskTypeID===1) { %>
          <div class="subtasks">
            <details>
              <summary role="button" class="secondary outline sub-item-dropdown">Subtasks</summary>
              <table class="table">
                <% if (task.subtasks.length> 0) { %>
                <thead>
                  <tr class="tile-row">
                    <th></th>
                    <th>Description</th>
                    <th>Due</th>
                    <th>Priority</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody class="subtask-table-body">
                  <% task.subtasks.forEach((subtask)=> { %>
                  <% var subtaskID = subtask.subtask_id %>
                  <% var subtaskDescription = subtask.subtask_description %>
                  <% var subtaskDueDate = subtask.subtask_due_date %>
                  <% var subtaskDueDateFormatted = subtask.subtask_due_date_formatted %>
                  <% var subtaskPriorityID = subtask.subtask_priority_id %>
                  <% var subtaskPriorityText = subtask.subtask_priority_text %>
                  <% var subtaskComplete = subtask.subtask_complete %>
                  <tr class="tile-row" data-subtask-id="<%= subtaskID %>">
                    <% if (subtask.subtask_complete===0) { %>
                    <td class="column-checkbox"><input type="checkbox" class="toggle-complete" data-subtask-id="<%= subtaskID %>" /></td>
                    <td class="subtask-description column "><%= subtaskDescription %></td>
                    <td class="subtask-due-date column " data-subtask-due-date="<%= subtaskDueDate %>"><%= subtaskDueDateFormatted %></td>
                    <td class="subtask-priority column " data-subtask-priority="<%= subtaskPriorityID %>"><%= subtaskPriorityText %></td>
                    <% } else { %>
                    <td class="column-checkbox"><input type="checkbox" class="toggle-complete" data-subtask-id="<%= subtaskID %>" checked /></td>
                    <td class="subtask-description checked-item column "><%= subtaskDescription %></td>
                    <td class="subtask-due-date checked-item column " data-subtask-due-date="<%= subtaskDueDate %>"><%= subtaskDueDateFormatted %></td>
                    <td class="subtask-priority checked-item column " data-subtask-priority="<%= subtaskPriorityID %>"><%= subtaskPriorityText %></td>
                    <% } %>
                    <td class="column column-buttons"><button class="button-table edit-button-table primary outline" data-subtask-id="<%= subtask.subtask_id %>">Edit</button><button class="button-table delete-button-table secondary outline" data-subtask-id="<%= subtask.subtask_id %>">Delete</button></td>
                  </tr>
                  <% }); %>
                </tbody>
                <% } %>
              </table>
              <form class="add-subtask-to-existing-task" method="post" action="/new-subtask">
                <fieldset class="add-subtask-fieldset" role="group">
                  <input class="add-subtask-field" type="text" placeholder="Add new subtask..." />
                  <input type="date" class="add-subtask-due-date" placeholder="Due by..." />
                  <select class="add-subtask-priority">
                    <option value="0" disabled selected>Priority (optional)</option>
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                  </select>
                  <button class="add-subtask-button" id="add-subtask-button">Add</button>
                </fieldset>
              </form>
            </details>
          </div>
          <% } else if (taskTypeID===2) { %>
          <div class="shopping-list">
            <table class="table">
              <% if (task.listItems.length> 0) { %>
              <thead>
                <tr class="tile-row">
                  <th></th>
                  <th>Item</th>
                  <th>Store</th>
                  <th>Quantity</th>
                  <th></th>
                </tr>
              </thead>
              <tbody class="shopping-list-table-body">
                <% task.listItems.forEach((listItem)=> { %>
                <!-- need to Declare the variables and tidy up below!-->
                <tr class="tile-row" data-list-item-id="<%= listItem.list_item_id %>">
                  <% if (listItem.list_item_complete===0) { %>
                  <td class="column-checkbox"><input type="checkbox" class="toggle-complete" data-list-item-id="<%= listItem.list_item_id %>" /></td>
                  <td class="list-item-name column "><%= listItem.list_item_name %></td>
                  <td class="list-item-store column "><%= listItem.list_item_store %></td>
                  <td class="list-item-quantity column "><%= listItem.list_item_quantity %></td>
                  <% } else { %>
                  <td class="column-checkbox"><input type="checkbox" class="toggle-complete" data-list-item-id="<%= listItem.list_item_id %>" checked /></td>
                  <td class="list-item-name column  checked-item"><%= listItem.list_item_name %></td>
                  <td class="list-item-store column  checked-item"><%= listItem.list_item_store %></td>
                  <td class="list-item-quantity column  checked-item"><%= listItem.list_item_quantity %></td>
                  <% } %>
                  <td class="column column-buttons">
                    <button class="button-table edit-button-table primary outline" data-list-item-id="<%= listItem.list_item_id %>">Edit</button>
                    <button class="button-table delete-button-table secondary outline" data-list-item-id="<%= listItem.list_item_id %>">Delete</button>
                  </td>
                </tr>
                <% }); %>
              </tbody>
              <% } %>
            </table>
            <form class="add-list-item-to-existing-task" method="post" action="/new-list-item">
              <fieldset class="add-subtask-fieldset" role="group">
                <input class="add-item-field" type="text" placeholder="Add new item to list..." />
                <input type="text" class="add-item-store" placeholder="Store" />
                <input type="text" class="add-item-quantity" placeholder="Quantity" />
                <button class="add-list-item-button" id="add-list-item-button">Add</button>
              </fieldset>
            </form>
          </div>
          <% } %>
          <div class="tile-footer">
            <div>
              <button class="mark-complete-button">Task Complete</button>
            </div>
            <div class="tile-footer-buttons">
              <button class="edit-button" data-tooltip="Hint: you can also edit an individual field by double-clicking on it!">Edit</button>
              <button class="delete-button secondary">
                <span id="bin-icon">
                  <svg fill="var(--pico-primary-background)" version="1.1" width="30" height="30" viewBox="0 0 408.483 408.483" xml:space="preserve">
                    <g>
                      <g>
                        <path d="M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699l13.705-289.316
			                        H74.043L87.748,388.784z M247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355c4.609,0,8.35,3.738,8.35,8.349v165.293
			                        c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329z M189.216,171.329
			                        c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.737,8.349-8.349,8.349h-13.355
			                        c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329z M130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356
			                        c4.61,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z" />
                        <path d="M343.567,21.043h-88.535V4.305c0-2.377-1.927-4.305-4.305-4.305h-92.971c-2.377,0-4.304,1.928-4.304,4.305v16.737H64.916
			                        c-7.125,0-12.9,5.776-12.9,12.901V74.47h304.451V33.944C356.467,26.819,350.692,21.043,343.567,21.043z" />
                      </g>
                    </g>
                  </svg>
                </span>
              </button>
            </div>
          </div>
          <% if (taskComplete) { %>
          <div class="overlay"></div>
          <div class="completed-task-label">
            <h2>Task "<%= taskTitle %>" completed on <%= new Date(taskCompletedTimestamp).toISOString().split('T')[0] %></h2>
            <button class="reopen-task-button">Reopen Task</button>
          </div>
          <% } %>
        </article>
    `;

}