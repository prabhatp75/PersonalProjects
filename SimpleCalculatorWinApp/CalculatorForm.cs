using System;
using System.Drawing;
using System.Windows.Forms;
using System.Collections.Generic;

namespace SimpleCalculator
{
    public partial class CalculatorForm : Form
    {
        private double currentValue = 0;
        private string currentOperation = "";
        private bool isNewNumber = true;
        private List<string> calculationHistory = new List<string>();
        private const int MAX_HISTORY = 5;
        
        // Store references to controls for resizing
        private TextBox display;
        private ListBox historyDisplay;
        private List<Button> scientificButtons = new List<Button>();
        private List<Button> numberButtons = new List<Button>();
        private Button clearButton;
        private Panel mainPanel;
        
        // Store original positions and sizes for scaling
        private Dictionary<Control, Rectangle> originalBounds = new Dictionary<Control, Rectangle>();
        
        // Dictionary to map keyboard keys to buttons
        private Dictionary<Keys, string> keyMap = new Dictionary<Keys, string>();

        public CalculatorForm()
        {
            InitializeComponent();
            this.Text = "Scientific Calculator";
            this.Size = new Size(900, 700);
            this.FormBorderStyle = FormBorderStyle.Sizable;
            this.MinimumSize = new Size(500, 400);
            this.StartPosition = FormStartPosition.CenterScreen;
            
            // Add resize event handler
            this.Resize += CalculatorForm_Resize;
            
            // Add key press event handler
            this.KeyPress += CalculatorForm_KeyPress;
            this.KeyDown += CalculatorForm_KeyDown;
            
            // Create main panel with scrollbars
            mainPanel = new Panel
            {
                Dock = DockStyle.Fill,
                AutoScroll = true,
                AutoSize = false,
                Padding = new Padding(10),
                BackColor = Color.WhiteSmoke
            };
            this.Controls.Add(mainPanel);

            // Create display
            display = new TextBox
            {
                Name = "display",
                Size = new Size(700, 60),
                Location = new Point(10, 10),
                Font = new Font("Arial", 32),
                TextAlign = HorizontalAlignment.Right,
                ReadOnly = true,
                BackColor = Color.White,
                BorderStyle = BorderStyle.FixedSingle
            };
            mainPanel.Controls.Add(display);
            originalBounds[display] = new Rectangle(display.Location, display.Size);

            // Create history display
            historyDisplay = new ListBox
            {
                Name = "historyDisplay",
                Size = new Size(700, 200),
                Location = new Point(720, 10),
                Font = new Font("Arial", 14),
                BackColor = Color.White,
                BorderStyle = BorderStyle.FixedSingle
            };
            mainPanel.Controls.Add(historyDisplay);
            originalBounds[historyDisplay] = new Rectangle(historyDisplay.Location, historyDisplay.Size);

            // Scientific functions
            string[] scientificButtons = {
                "sin", "cos", "tan",
                "√", "x²", "xʸ",
                "log", "ln", "π",
                "(", ")", "±"
            };

            int sciButtonWidth = 160;
            int sciButtonHeight = 60;
            int startX = 10;
            int startY = 80;

            // Add scientific buttons
            for (int i = 0; i < scientificButtons.Length; i++)
            {
                Button button = new Button
                {
                    Text = scientificButtons[i],
                    Size = new Size(sciButtonWidth, sciButtonHeight),
                    Location = new Point(startX + (i % 3) * (sciButtonWidth + 5),
                                      startY + (i / 3) * (sciButtonHeight + 5)),
                    Font = new Font("Arial", 20),
                    BackColor = Color.LightBlue,
                    FlatStyle = FlatStyle.Flat,
                    FlatAppearance = { BorderColor = Color.Gray }
                };
                button.Click += ScientificButton_Click;
                mainPanel.Controls.Add(button);
                this.scientificButtons.Add(button);
                originalBounds[button] = new Rectangle(button.Location, button.Size);
            }

            // Number buttons
            string[] buttonTexts = {
                "7", "8", "9", "/",
                "4", "5", "6", "*",
                "1", "2", "3", "-",
                "0", ".", "=", "+"
            };

            int buttonWidth = 160;
            int buttonHeight = 90;
            startY = 320;

            for (int i = 0; i < buttonTexts.Length; i++)
            {
                Button button = new Button
                {
                    Text = buttonTexts[i],
                    Size = new Size(buttonWidth, buttonHeight),
                    Location = new Point(startX + (i % 4) * (buttonWidth + 5),
                                      startY + (i / 4) * (buttonHeight + 5)),
                    Font = new Font("Arial", 28),
                    FlatStyle = FlatStyle.Flat,
                    FlatAppearance = { BorderColor = Color.Gray }
                };

                if (buttonTexts[i] == "=")
                {
                    button.BackColor = Color.LightGreen;
                }
                else if ("+-*/".Contains(buttonTexts[i]))
                {
                    button.BackColor = Color.LightGray;
                }
                else
                {
                    button.BackColor = Color.White;
                }

                button.Click += Button_Click;
                mainPanel.Controls.Add(button);
                this.numberButtons.Add(button);
                originalBounds[button] = new Rectangle(button.Location, button.Size);
            }

            // Clear button
            clearButton = new Button
            {
                Text = "C",
                Size = new Size(700, 60),
                Location = new Point(10, startY + 4 * (buttonHeight + 5) + 5),
                Font = new Font("Arial", 28),
                BackColor = Color.LightPink,
                FlatStyle = FlatStyle.Flat,
                FlatAppearance = { BorderColor = Color.Gray }
            };
            clearButton.Click += ClearButton_Click;
            mainPanel.Controls.Add(clearButton);
            originalBounds[clearButton] = new Rectangle(clearButton.Location, clearButton.Size);
            
            // Set the panel's auto scroll minimum size
            mainPanel.AutoScrollMinSize = new Size(1450, 700);
            
            // Initialize key mapping
            InitializeKeyMap();
        }
        
        private void InitializeKeyMap()
        {
            // Map number keys
            keyMap[Keys.D0] = "0";
            keyMap[Keys.D1] = "1";
            keyMap[Keys.D2] = "2";
            keyMap[Keys.D3] = "3";
            keyMap[Keys.D4] = "4";
            keyMap[Keys.D5] = "5";
            keyMap[Keys.D6] = "6";
            keyMap[Keys.D7] = "7";
            keyMap[Keys.D8] = "8";
            keyMap[Keys.D9] = "9";
            
            // Map numpad keys
            keyMap[Keys.NumPad0] = "0";
            keyMap[Keys.NumPad1] = "1";
            keyMap[Keys.NumPad2] = "2";
            keyMap[Keys.NumPad3] = "3";
            keyMap[Keys.NumPad4] = "4";
            keyMap[Keys.NumPad5] = "5";
            keyMap[Keys.NumPad6] = "6";
            keyMap[Keys.NumPad7] = "7";
            keyMap[Keys.NumPad8] = "8";
            keyMap[Keys.NumPad9] = "9";
            
            // Map operation keys
            keyMap[Keys.OemMinus] = "-";
            keyMap[Keys.Oemplus] = "+";
            keyMap[Keys.OemPeriod] = ".";
            keyMap[Keys.Divide] = "/";
            keyMap[Keys.Multiply] = "*";
            keyMap[Keys.Subtract] = "-";
            keyMap[Keys.Add] = "+";
            keyMap[Keys.Decimal] = ".";
            keyMap[Keys.Return] = "=";
            keyMap[Keys.Enter] = "=";
            keyMap[Keys.Escape] = "C";
        }
        
        private void CalculatorForm_KeyPress(object sender, KeyPressEventArgs e)
        {
            // Handle number keys and decimal point
            if (char.IsDigit(e.KeyChar) || e.KeyChar == '.')
            {
                if (isNewNumber)
                {
                    display.Text = e.KeyChar.ToString();
                    isNewNumber = false;
                }
                else
                {
                    display.Text += e.KeyChar;
                }
                e.Handled = true;
            }
        }
        
        private void CalculatorForm_KeyDown(object sender, KeyEventArgs e)
        {
            // Handle operation keys
            if (keyMap.ContainsKey(e.KeyCode))
            {
                string keyValue = keyMap[e.KeyCode];
                
                if (keyValue == "C")
                {
                    ClearButton_Click(sender, e);
                }
                else if (keyValue == "=")
                {
                    CalculateResult();
                }
                else if ("+-*/".Contains(keyValue))
                {
                    if (!string.IsNullOrEmpty(display.Text))
                    {
                        if (!isNewNumber)
                        {
                            CalculateResult();
                        }
                        currentValue = double.Parse(display.Text);
                        currentOperation = keyValue;
                        isNewNumber = true;
                    }
                }
                else
                {
                    if (isNewNumber)
                    {
                        display.Text = keyValue;
                        isNewNumber = false;
                    }
                    else
                    {
                        display.Text += keyValue;
                    }
                }
                
                e.Handled = true;
            }
        }
        
        private void CalculatorForm_Resize(object sender, EventArgs e)
        {
            // Calculate scaling factors
            float scaleX = (float)this.ClientSize.Width / 900;
            float scaleY = (float)this.ClientSize.Height / 700;
            
            // Scale font sizes based on window size
            float fontScale = Math.Min(scaleX, scaleY);
            
            // Update display
            if (display != null)
            {
                display.Font = new Font("Arial", 32 * fontScale);
            }
            
            // Update history display
            if (historyDisplay != null)
            {
                historyDisplay.Font = new Font("Arial", 14 * fontScale);
            }
            
            // Update scientific buttons
            foreach (Button button in scientificButtons)
            {
                if (originalBounds.ContainsKey(button))
                {
                    Rectangle original = originalBounds[button];
                    button.Size = new Size(
                        (int)(original.Width * scaleX),
                        (int)(original.Height * scaleY)
                    );
                    button.Location = new Point(
                        (int)(original.X * scaleX),
                        (int)(original.Y * scaleY)
                    );
                    button.Font = new Font("Arial", 20 * fontScale);
                }
            }
            
            // Update number buttons
            foreach (Button button in numberButtons)
            {
                if (originalBounds.ContainsKey(button))
                {
                    Rectangle original = originalBounds[button];
                    button.Size = new Size(
                        (int)(original.Width * scaleX),
                        (int)(original.Height * scaleY)
                    );
                    button.Location = new Point(
                        (int)(original.X * scaleX),
                        (int)(original.Y * scaleY)
                    );
                    button.Font = new Font("Arial", 28 * fontScale);
                }
            }
            
            // Update clear button
            if (clearButton != null && originalBounds.ContainsKey(clearButton))
            {
                Rectangle original = originalBounds[clearButton];
                clearButton.Size = new Size(
                    (int)(original.Width * scaleX),
                    (int)(original.Height * scaleY)
                );
                clearButton.Location = new Point(
                    (int)(original.X * scaleX),
                    (int)(original.Y * scaleY)
                );
                clearButton.Font = new Font("Arial", 28 * fontScale);
            }
        }

        private void ScientificButton_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            TextBox display = (TextBox)mainPanel.Controls["display"];
            double result = 0;
            string operation = "";

            try
            {
                if (!string.IsNullOrEmpty(display.Text))
                {
                    double value = double.Parse(display.Text);
                    switch (button.Text)
                    {
                        case "sin":
                            result = Math.Sin(value * Math.PI / 180);
                            operation = $"sin({value})";
                            break;
                        case "cos":
                            result = Math.Cos(value * Math.PI / 180);
                            operation = $"cos({value})";
                            break;
                        case "tan":
                            result = Math.Tan(value * Math.PI / 180);
                            operation = $"tan({value})";
                            break;
                        case "√":
                            if (value < 0)
                                throw new ArgumentException("Cannot calculate square root of a negative number");
                            result = Math.Sqrt(value);
                            operation = $"√({value})";
                            break;
                        case "x²":
                            result = Math.Pow(value, 2);
                            operation = $"{value}²";
                            break;
                        case "log":
                            if (value <= 0)
                                throw new ArgumentException("Cannot calculate logarithm of a non-positive number");
                            result = Math.Log10(value);
                            operation = $"log({value})";
                            break;
                        case "ln":
                            if (value <= 0)
                                throw new ArgumentException("Cannot calculate natural logarithm of a non-positive number");
                            result = Math.Log(value);
                            operation = $"ln({value})";
                            break;
                        case "π":
                            result = Math.PI;
                            operation = "π";
                            break;
                        case "±":
                            result = -value;
                            operation = $"-({value})";
                            break;
                    }

                    display.Text = result.ToString();
                    AddToHistory($"{operation} = {result}");
                    isNewNumber = true;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.Message}", "Calculation Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void Button_Click(object sender, EventArgs e)
        {
            Button button = (Button)sender;
            TextBox display = (TextBox)mainPanel.Controls["display"];

            if (button.Text == "=")
            {
                CalculateResult();
            }
            else if ("+-*/".Contains(button.Text))
            {
                if (!string.IsNullOrEmpty(display.Text))
                {
                    if (!isNewNumber)
                    {
                        CalculateResult();
                    }
                    currentValue = double.Parse(display.Text);
                    currentOperation = button.Text;
                    isNewNumber = true;
                }
            }
            else
            {
                if (isNewNumber)
                {
                    display.Text = button.Text;
                    isNewNumber = false;
                }
                else
                {
                    display.Text += button.Text;
                }
            }
        }

        private void CalculateResult()
        {
            TextBox display = (TextBox)mainPanel.Controls["display"];
            if (string.IsNullOrEmpty(currentOperation) || string.IsNullOrEmpty(display.Text))
                return;

            try
            {
                double secondValue = double.Parse(display.Text);
                double result = 0;

                switch (currentOperation)
                {
                    case "+":
                        result = currentValue + secondValue;
                        break;
                    case "-":
                        result = currentValue - secondValue;
                        break;
                    case "*":
                        result = currentValue * secondValue;
                        break;
                    case "/":
                        if (secondValue != 0)
                            result = currentValue / secondValue;
                        else
                        {
                            MessageBox.Show("Cannot divide by zero!", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                            return;
                        }
                        break;
                }

                string calculation = $"{currentValue} {currentOperation} {secondValue} = {result}";
                AddToHistory(calculation);
                display.Text = result.ToString();
                currentOperation = "";
                isNewNumber = true;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.Message}", "Calculation Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void AddToHistory(string calculation)
        {
            calculationHistory.Insert(0, calculation);
            if (calculationHistory.Count > MAX_HISTORY)
            {
                calculationHistory.RemoveAt(calculationHistory.Count - 1);
            }

            ListBox historyDisplay = (ListBox)mainPanel.Controls["historyDisplay"];
            historyDisplay.Items.Clear();
            historyDisplay.Items.AddRange(calculationHistory.ToArray());
        }

        private void ClearButton_Click(object sender, EventArgs e)
        {
            TextBox display = (TextBox)mainPanel.Controls["display"];
            display.Text = "";
            currentValue = 0;
            currentOperation = "";
            isNewNumber = true;
        }
    }
} 