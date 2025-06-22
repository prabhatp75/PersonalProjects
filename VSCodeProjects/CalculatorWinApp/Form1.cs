namespace Calculator;

public partial class Form1 : Form
{
    private System.Windows.Forms.TextBox? display;
    private System.Windows.Forms.Button[]? digitButtons;
    private System.Windows.Forms.Button? addButton;
    private System.Windows.Forms.Button? subButton;
    private System.Windows.Forms.Button? mulButton;
    private System.Windows.Forms.Button? divButton;
    private System.Windows.Forms.Button? eqButton;
    private System.Windows.Forms.Button? clrButton;

    private double firstOperand = 0;
    private string? operation = null;
    private bool isNewEntry = true;

    public Form1()
    {
        InitializeComponent();
    }

    private void DigitButton_Click(object? sender, EventArgs e)
    {
        if (display == null || sender is not Button btn) return;
        if (isNewEntry || display.Text == "0")
            display.Text = btn.Text;
        else
            display.Text += btn.Text;
        isNewEntry = false;
    }

    private void OperatorButton_Click(object? sender, EventArgs e)
    {
        if (display == null || sender is not Button btn) return;
        if (double.TryParse(display.Text, out double value))
            firstOperand = value;
        operation = btn.Text;
        isNewEntry = true;
    }

    private void EqButton_Click(object? sender, EventArgs e)
    {
        if (display == null || operation == null) return;
        if (!double.TryParse(display.Text, out double secondOperand)) return;
        double result = firstOperand;
        switch (operation)
        {
            case "+": result += secondOperand; break;
            case "-": result -= secondOperand; break;
            case "*": result *= secondOperand; break;
            case "/": result = secondOperand != 0 ? result / secondOperand : 0; break;
        }
        display.Text = result.ToString();
        isNewEntry = true;
        operation = null;
    }

    private void ClrButton_Click(object? sender, EventArgs e)
    {
        if (display == null) return;
        display.Text = "0";
        firstOperand = 0;
        operation = null;
        isNewEntry = true;
    }
}
