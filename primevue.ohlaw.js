export const ohLawPreset = {
  primitive: {
    chambray: {
      50: '#f5f7fa',
      100: '#e9edf5',
      200: '#cfd9e8',
      300: '#a4b7d5',
      400: '#7391bd',
      500: '#5173a6',
      600: '#3f5c8a',
      700: '#38507a',
      800: '#2e3f5e',
      900: '#2a3750',
      950: '#1c2435'
    },
    apple: {
      50: '#f1fcf2',
      100: '#dff9e4',
      200: '#c1f1cb',
      300: '#90e5a3',
      400: '#58d073',
      500: '#32b550',
      600: '#28a745',
      700: '#1f7634',
      800: '#1e5d2d',
      900: '#1a4d27',
      950: '#092a12',
    },
    'red-ribbon': {
      50: '#fef2f2',
      100: '#fee6e5',
      200: '#fccfcf',
      300: '#f9a8a8',
      400: '#f57779',
      500: '#ec474f',
      600: '#dc3545',
      700: '#b7192c',
      800: '#99182c',
      900: '#83182c',
      950: '#490812',
    },
    blueBase: { // alt for primary
      50: "#eef6fc",
      100: "#d8eaf8",
      200: "#b6d7f1",
      300: "#8abde7",
      400: "#579ada",
      500: "#3379cd",
      600: "#1a56b3",
      700: "#164592",
      800: "#163a77",
      900: "#173464",
      950: "#0f203e"
    },
    grayAlt: { // secondary = 600
      50: "#f8f9fa",
      100: "#f1f3f5",
      200: "#e9ecef",
      300: "#dee2e6",
      400: "#ced4da",
      500: "#adb5bd",
      600: "#6c757d",
      700: "#495057",
      800: "#343a40",
      900: "#212529",
      950: "#0f1113"
    },
    emerald2: { // success = 600
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#28a745",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
      950: "#022c22"
    },
    aqua: { // info = 600
      50: "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#22d3ee",
      500: "#06b6d4",
      600: "#17a2b8",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
      950: "#082f49"
    },
    amber2: { // warning = 600
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#ffc107",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
      950: "#451a03"
    },
    ruby: { // danger = 600
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc3545",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      950: "#450a0a"
    },
    silver: { // light = 600
      50: "#ffffff",
      100: "#fafafa",
      200: "#f5f5f5",
      300: "#e5e5e5",
      400: "#d4d4d4",
      500: "#a3a3a3",
      600: "#f8f9fa",
      700: "#525252",
      800: "#404040",
      900: "#262626",
      950: "#171717"
    },
    charcoal: { // dark = 600
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#343a40",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
      950: "#030712"
    }
  },
  semantic: {
    primary: {
      50: '{chambray.50}',
      100: '{chambray.100}',
      200: '{chambray.200}',
      300: '{chambray.300}',
      400: '{chambray.400}',
      500: '{chambray.500}',
      600: '{chambray.600}',
      700: '{chambray.700}',
      800: '{chambray.800}',
      900: '{chambray.900}',
      950: '{chambray.950}'
    },
    colorScheme: {
      light: {
        success: {
          color: '{emerald.500}',
          contrastColor: '{primary.950}',
          hoverColor: '{primary.200}',
          activeColor: '{primary.300}',
          background: '{emerald.500}',
          focusBackground: '{primary.300}',
          focusColor: '{primary.950}'
        }
      }
    }
  },
  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            success: {
              background: '{emerald2-600}',
              hoverBackground: '{emerald2-800}'
            }
          }
        }
      }
    },
    menubar: {
      background: 'rgba(0, 0, 0, 0)',
      borderColor: 'rgba(0, 0, 0, 0)',
    },
    progressspinner: {
      strokeColor: '{primary.600}',
      animationDuration: '1.5s'
    }
  }
}