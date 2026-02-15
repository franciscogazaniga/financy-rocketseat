  /** @type {import('tailwindcss').Config} */
  import tailwindcssAnimate from "tailwindcss-animate"

  export default {
    darkMode: ["class"],
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
    ],
    theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
        colors: {
            brand: {
              base: "hsl(var(--brand-base))",
              dark: "hsl(var(--brand-dark))",
            },
            gray: {
              900: "hsl(var(--gray-900))",
              800: "hsl(var(--gray-800))",
              700: "hsl(var(--gray-700))",
              600: "hsl(var(--gray-600))",
              400: "hsl(var(--gray-400))",
              200: "hsl(var(--gray-200))",
              100: "hsl(var(--gray-100))",
            },

            danger: "hsl(var(--danger))",
            success: "hsl(var(--success))",

            black: "hsl(var(--black))",
            white: "hsl(var(--white))",

            blue: {
              dark: "hsl(var(--blue-dark))",
              base: "hsl(var(--blue-base))",
              light: "hsl(var(--blue-light))",
            },

            purple: {
              dark: "hsl(var(--purple-dark))",
              base: "hsl(var(--purple-base))",
              light: "hsl(var(--purple-light))",
            },

            pink: {
              dark: "hsl(var(--pink-dark))",
              base: "hsl(var(--pink-base))",
              light: "hsl(var(--pink-light))",
            },

            red: {
              dark: "hsl(var(--red-dark))",
              base: "hsl(var(--red-base))",
              light: "hsl(var(--red-light))",
            },

            orange: {
              dark: "hsl(var(--orange-dark))",
              base: "hsl(var(--orange-base))",
              light: "hsl(var(--orange-light))",
            },

            yellow: {
              dark: "hsl(var(--yellow-dark))",
              base: "hsl(var(--yellow-base))",
              light: "hsl(var(--yellow-light))",
            },

            green: {
              dark: "hsl(var(--green-dark))",
              base: "hsl(var(--green-base))",
              light: "hsl(var(--green-light))",
            },

            background: "hsl(var(--background))",
            card: "hsl(var(--white))",

            button: {
              text: "hsl(var(--white))",
              border: "hsl(var(--button-border))",
              secondary: {
                text: "hsl(var(--button-secondary-text))"
              },
            },

            title: {
              primary: "hsl(var(--title-primary))",
              secondary: "hsl(var(--title-secondary))",
            },


            foreground: "hsl(var(--foreground))",

            label: "hsl(var(--label))",
            input: {
              default: "hsl(var(--input))",
              focus: "hsl(var(--input-focus))",
            },

            border: "hsl(var(--border))",

            income: "hsl(var(--income))",
            expense: "hsl(var(--expense))",
        },
        fontFamily: {
          sans: ["var(--font-sans)"],
        },
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
    plugins: [tailwindcssAnimate, require("tailwindcss-animate")],
  }