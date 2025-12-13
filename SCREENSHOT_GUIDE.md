# Screenshot Guide for VehicleIQ README

## Required Screenshots

Please take the following screenshots and save them in the `screenshots/` folder with these exact names:

### 1. **dashboard-main.png**
**What to capture**: Main dashboard view
- Full browser window showing the complete dashboard
- Map with vehicle markers visible
- Stat cards on the right (Fleet Status, Avg Speed, Low Fuel, High Temp)
- Vehicle table at the bottom
- Alerts panel visible
- Make sure some vehicles are active and moving

**Recommended size**: 1920x1080 or 1440x900

---

### 2. **ai-assistant.png**
**What to capture**: AI Assistant panel
- Focus on the AI Assistant chat interface (right side of dashboard)
- Show a conversation with the AI
- Example questions you can ask:
  - "Which vehicles need service?"
  - "Show me vehicles with low fuel"
  - "What's the status of VEH-001?"
- Make sure the chat shows both questions and AI responses

**Recommended size**: 800x600 (cropped to show just the AI panel)

---

### 3. **vehicle-details.png**
**What to capture**: Vehicle detail modal
- Click on any vehicle in the table to open the detail modal
- Show the modal with:
  - Vehicle information
  - Current telemetry data
  - Any alerts for that vehicle
- Make sure the modal is centered and fully visible

**Recommended size**: 1200x800

---

### 4. **alerts-panel.png**
**What to capture**: Alerts panel
- Focus on the alerts panel (right side of dashboard)
- Make sure there are several alerts visible:
  - Low fuel warnings
  - High temperature alerts
  - Maintenance alerts
- Show the color coding (red for critical, yellow for warnings)

**Recommended size**: 600x800 (cropped to show just the alerts panel)

---

### 5. **backend-sync.png**
**What to capture**: Backend sync loading popup
- This is tricky - you'll need to capture it quickly when the page first loads
- **How to capture**:
  1. Open the app in a new incognito window
  2. Have your screenshot tool ready
  3. Navigate to http://localhost:5174
  4. Quickly capture the loading popup that appears
- Should show the glassmorphic popup with "Backend Syncing" or "Connecting to Backend"

**Recommended size**: 1920x1080 (full screen with popup centered)

---

## Screenshot Tips

### For macOS:
- **Full Screen**: `Cmd + Shift + 3`
- **Selected Area**: `Cmd + Shift + 4`
- **Window**: `Cmd + Shift + 4`, then press `Space`, then click the window

### For Windows:
- **Full Screen**: `PrtScn` or `Win + PrtScn`
- **Selected Area**: `Win + Shift + S`
- Use Snipping Tool or Snip & Sketch

### Best Practices:
1. **Clean browser**: Hide bookmarks bar, close unnecessary tabs
2. **Full screen**: Use F11 or maximize the browser window
3. **Good data**: Make sure the dashboard has interesting data showing
4. **High resolution**: Take screenshots at your monitor's native resolution
5. **Crop if needed**: Remove unnecessary browser chrome if it doesn't add value

---

## After Taking Screenshots

1. Save all screenshots in the `screenshots/` folder with the exact names listed above
2. Verify the file names match exactly (case-sensitive)
3. The README will automatically reference these images

---

## Optional: Additional Screenshots

If you want to showcase more features, you can also add:

- `telemetry-chart.png` - Close-up of the telemetry chart
- `fleet-map.png` - Full-screen view of the map with all vehicles
- `command-center.png` - The command center (press Cmd/Ctrl + K)
- `filters.png` - Vehicle filters in action

Just add them to the `screenshots/` folder and update the README if needed!
