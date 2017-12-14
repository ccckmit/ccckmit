using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace Painter
{
    public partial class FormPainter : Form
    {
        Graphics g;
        Pen pen = new Pen(Color.Black, 3);
        Bitmap bitmap;

        public FormPainter()
        {
            InitializeComponent();

            bitmap = new Bitmap(this.Width, this.Height);
            pictureBox.Image = bitmap;
            g = Graphics.FromImage(bitmap);
        }

        bool isMouseDown = false;

        List<Point> points = new List<Point>();

        private void addPoint(int x, int y)
        {
            points.Add(new Point(x, y));
            if (points.Count >= 2)
            {
                if (points[points.Count - 2].X != -1 && points[points.Count - 1].X != -1)
                    g.DrawLine(pen, points[points.Count - 2], points[points.Count - 1]);
                pictureBox.Refresh();
            }
        }

        private void pictureBox_MouseDown(object sender, MouseEventArgs e)
        {
            isMouseDown = true;
            addPoint(e.X, e.Y);
        }

        private void pictureBox_MouseMove(object sender, MouseEventArgs e)
        {
            if (isMouseDown)
                addPoint(e.X, e.Y);
        }

        private void pictureBox_MouseUp(object sender, MouseEventArgs e)
        {
            addPoint(e.X, e.Y);
            addPoint(-1, -1);
            isMouseDown = false;
        }

        private void buttonClear_Click(object sender, EventArgs e)
        {
            points.Clear();
            g.Clear(Color.White);
            pictureBox.Refresh();
        }

        private void buttonSave_Click(object sender, EventArgs e)
        {
            bitmap.Save("c:\\Painter.jpg", System.Drawing.Imaging.ImageFormat.Jpeg);
        }

    }
}
