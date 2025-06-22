namespace Calculator;

partial class Form1
{
    /// <summary>
    ///  Required designer variable.
    /// </summary>
    private System.ComponentModel.IContainer components = null;

    /// <summary>
    ///  Clean up any resources being used.
    /// </summary>
    /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
    protected override void Dispose(bool disposing)
    {
        if (disposing && (components != null))
        {
            components.Dispose();
        }
        base.Dispose(disposing);
    }

    #region Windows Form Designer generated code

    /// <summary>
    ///  Required method for Designer support - do not modify
    ///  the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent()
    {
        this.components = new System.ComponentModel.Container();
        this.display = new System.Windows.Forms.TextBox();
        this.digitButtons = new System.Windows.Forms.Button[10];
        this.addButton = new System.Windows.Forms.Button();
        this.subButton = new System.Windows.Forms.Button();
        this.mulButton = new System.Windows.Forms.Button();
        this.divButton = new System.Windows.Forms.Button();
        this.eqButton = new System.Windows.Forms.Button();
        this.clrButton = new System.Windows.Forms.Button();
        this.SuspendLayout();
        // 
        // display
        // 
        this.display.Font = new System.Drawing.Font("Segoe UI", 18F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
        this.display.Location = new System.Drawing.Point(12, 12);
        this.display.Name = "display";
        this.display.ReadOnly = true;
        this.display.Size = new System.Drawing.Size(276, 39);
        this.display.TabIndex = 0;
        this.display.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
        // 
        // digitButtons
        // 
        for (int i = 0; i < 10; i++)
        {
            this.digitButtons[i] = new System.Windows.Forms.Button();
            this.digitButtons[i].Font = new System.Drawing.Font("Segoe UI", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.digitButtons[i].Size = new System.Drawing.Size(60, 40);
            this.digitButtons[i].TabIndex = i + 1;
            this.digitButtons[i].Text = i.ToString();
            this.digitButtons[i].UseVisualStyleBackColor = true;
            this.digitButtons[i].Click += new System.EventHandler(this.DigitButton_Click);
        }
        // Position digit buttons (standard calculator layout)
        int startX = 12, startY = 60, padding = 6;
        for (int i = 1; i <= 9; i++)
        {
            int row = 2 - (i - 1) / 3;
            int col = (i - 1) % 3;
            this.digitButtons[i].Location = new System.Drawing.Point(startX + col * (60 + padding), startY + row * (40 + padding));
        }
        // 0 button
        this.digitButtons[0].Location = new System.Drawing.Point(startX + (60 + padding), startY + 3 * (40 + padding));
        // 
        // addButton
        // 
        this.addButton.Font = new System.Drawing.Font("Segoe UI", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
        this.addButton.Location = new System.Drawing.Point(startX + 3 * (60 + padding), startY);
        this.addButton.Size = new System.Drawing.Size(60, 40);
        this.addButton.Text = "+";
        this.addButton.UseVisualStyleBackColor = true;
        this.addButton.Click += new System.EventHandler(this.OperatorButton_Click);
        // 
        // subButton
        // 
        this.subButton.Font = new System.Drawing.Font("Segoe UI", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
        this.subButton.Location = new System.Drawing.Point(startX + 3 * (60 + padding), startY + (40 + padding));
        this.subButton.Size = new System.Drawing.Size(60, 40);
        this.subButton.Text = "-";
        this.subButton.UseVisualStyleBackColor = true;
        this.subButton.Click += new System.EventHandler(this.OperatorButton_Click);
        // 
        // mulButton
        // 
        this.mulButton.Font = new System.Drawing.Font("Segoe UI", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
        this.mulButton.Location = new System.Drawing.Point(startX + 3 * (60 + padding), startY + 2 * (40 + padding));
        this.mulButton.Size = new System.Drawing.Size(60, 40);
        this.mulButton.Text = "*";
        this.mulButton.UseVisualStyleBackColor = true;
        this.mulButton.Click += new System.EventHandler(this.OperatorButton_Click);
        // 
        // divButton
        // 
        this.divButton.Font = new System.Drawing.Font("Segoe UI", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
        this.divButton.Location = new System.Drawing.Point(startX + 3 * (60 + padding), startY + 3 * (40 + padding));
        this.divButton.Size = new System.Drawing.Size(60, 40);
        this.divButton.Text = "/";
        this.divButton.UseVisualStyleBackColor = true;
        this.divButton.Click += new System.EventHandler(this.OperatorButton_Click);
        // 
        // eqButton
        // 
        this.eqButton.Font = new System.Drawing.Font("Segoe UI", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
        this.eqButton.Location = new System.Drawing.Point(startX + 2 * (60 + padding), startY + 3 * (40 + padding));
        this.eqButton.Size = new System.Drawing.Size(60, 40);
        this.eqButton.Text = "=";
        this.eqButton.UseVisualStyleBackColor = true;
        this.eqButton.Click += new System.EventHandler(this.EqButton_Click);
        // 
        // clrButton
        // 
        this.clrButton.Font = new System.Drawing.Font("Segoe UI", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
        this.clrButton.Location = new System.Drawing.Point(startX, startY + 3 * (40 + padding));
        this.clrButton.Size = new System.Drawing.Size(60, 40);
        this.clrButton.Text = "C";
        this.clrButton.UseVisualStyleBackColor = true;
        this.clrButton.Click += new System.EventHandler(this.ClrButton_Click);
        // 
        // Form1
        // 
        this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
        this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
        this.ClientSize = new System.Drawing.Size(300, 250);
        this.Controls.Add(this.display);
        foreach (var btn in this.digitButtons) this.Controls.Add(btn);
        this.Controls.Add(this.addButton);
        this.Controls.Add(this.subButton);
        this.Controls.Add(this.mulButton);
        this.Controls.Add(this.divButton);
        this.Controls.Add(this.eqButton);
        this.Controls.Add(this.clrButton);
        this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
        this.MaximizeBox = false;
        this.Name = "Form1";
        this.Text = "Calculator";
        this.ResumeLayout(false);
        this.PerformLayout();
    }

    #endregion
}
