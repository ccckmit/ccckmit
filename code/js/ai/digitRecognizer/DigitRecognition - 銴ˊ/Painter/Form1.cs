using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using System.Diagnostics;
using System.IO;

namespace Painter
{
    public partial class FormPainter : Form
    {
        Graphics g;
        Pen pen = new Pen(Color.Black, 3);
        Bitmap bitmap;
        ListQA qaList = new ListQA();
        String qaFileName = "DigitRecognizerQA.txt";
        Recognizer recognizer = new Recognizer();

        public FormPainter()
        {
            InitializeComponent();

            qaList.load(TextFile.file2str(qaFileName));
            recognizer.qaList = qaList;

            bitmap = new Bitmap(this.Width, this.Height);
            pictureBox.Image = bitmap;
            g = Graphics.FromImage(bitmap);
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
        }

        bool isMouseDown = false;

        Path points = new Path();

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
//          bitmap.Save("c:\\Painter.jpg", System.Drawing.Imaging.ImageFormat.Jpeg);
            char answer = textBoxAnswer.Text[0];
            Path path = new Path();
            path.AddRange(points);
            qaList.Add(new QA(answer, path));
        }

        private void FormPainter_FormClosing(object sender, FormClosingEventArgs e)
        {
            TextFile.str2file(qaFileName, qaList.ToString());
        }

        private void buttonAnswer_Click(object sender, EventArgs e)
        {
            textBoxAnswer.Text = recognizer.recoginze(points)+"";
        }
    }

    public class Path : List<Point>
    {
        public override String ToString()
        {
            StringBuilder str = new StringBuilder();
            for (int i = 0; i < this.Count; i++)
            {
                str.Append(this[i].X + "," + this[i].Y+";");
            }
            return str.ToString();
        }

        public void load(String str)
        {
            String[] tokens = str.Split(';');
            for (int i = 0; i < tokens.Length; i++)
            {
                if (tokens[i].Trim().Length > 0)
                {
                    String[] parts = tokens[i].Split(',');
                    Point p = new Point(int.Parse(parts[0]), int.Parse(parts[1]));
                    this.Add(p);
                }
            }
        }

        public Rectangle boundingBox()
        {
            int minX = int.MaxValue;
            int minY = int.MaxValue;
            int maxX = int.MinValue;
            int maxY = int.MinValue;
            foreach (Point p in this)
            {
                if (p.X == -1 || p.Y == -1) continue;
                if (p.X < minX) minX = p.X;
                if (p.Y < minY) minY = p.Y;
                if (p.X > maxX) maxX = p.X;
                if (p.Y > maxY) maxY = p.Y;
            }
            Rectangle box = new Rectangle(minX, minY, maxX - minX, maxY - minY);
            return box;
        }
    }

    public class QA {
        public Path Q = new Path();
        public char A = ' ';
        public QA(char a, Path q) { A=a; Q = q; }
        public override String ToString() {
            return A+"="+Q.ToString();
        }
    }

    public class ListQA : List<QA> {
        public ListQA() {}
        public void load(String text) {
            String[] lines = text.Split('\n');
            foreach (String line in lines)
            {
                if (line.Trim().Length > 0)
                {
                    Path path = new Path();
                    path.load(line.Substring(2));
                    this.Add(new QA(line[0], path));
                }
            }
        }
        public override String ToString()
        {
            return String.Join("\n", this);
        }
    }

    public static class TextFile
    {
        public static String file2str(string fileName) {
            StreamReader reader = new StreamReader(fileName);
            String text = reader.ReadToEnd();
            reader.Close();
            return text;
        }

        public static void str2file(string fileName, string text)
        {
            StreamWriter writer = new StreamWriter(fileName);
            writer.Write(text);
            writer.Close();
        }
    }

    public class Recognizer
    {
        public ListQA qaList;

        public static double dist(Point p1, Point p2) {
            return Math.Sqrt(Math.Pow(p1.X-p2.X,2)+Math.Pow(p1.Y-p2.Y,2));
        }

        public double diameter(Rectangle box)
        {
            return Math.Max(box.Width, box.Height);
        }

        public double pathLength(Path path)
        {
            double pLen = 0;
            for (int i=1; i<path.Count; i++) {
                var p1 = path[i - 1];
                var p2 = path[i];
                if (p1.X >= 0 && p2.X >= 0) {
                    pLen += dist(p1, p2);
                }
            }
            Rectangle box = path.boundingBox();
            return pLen / diameter(box);
        }

        public double distBeginEnd(Path p1, Path p2)
        {
            Point begin1 = p1[0], begin2 = p2[0];
            Point end1   = p1[p1.Count - 2], end2 = p2[p2.Count - 2];
            double dx1 = end1.X - begin1.X;
            double dy1 = end1.Y - begin1.Y;
            double dx2 = end2.X - begin2.X;
            double dy2 = end2.Y - begin2.Y;
            double dist1 = dist(begin1, end1);
            double dist2 = dist(begin2, end2);
            double ndx1 = dx1 / dist1, ndy1 = dy1 / dist1;
            double ndx2 = dx2 / dist2, ndy2 = dy2 / dist2;
            return Math.Sqrt(Math.Pow(ndx1 - ndx2, 2) + Math.Pow(ndx1 - ndx2, 2));
        }

        public int breakCount(Path path) {
            int count = 0;
            foreach (Point p in path)
            {
                if (p.X == -1) count++;
            }
            return count;
        }

        public void print(Path path)
        {
            double pLen = pathLength(path);
//          double pDist = distBeginEnd(path);
            double pBreaks = breakCount(path);
            Debug.WriteLine("  pLen = " + pLen /*+ " beDist=" + pDist*/ + " breakCount=" + pBreaks);
        }

        public double dist(Path s, Path p) {
            double lenDist = Math.Abs(pathLength(s) - pathLength(p));
            double beginEndDist = distBeginEnd(s, p);
            double breakDist = Math.Abs(breakCount(s)-breakCount(p));
            Debug.WriteLine("  lenDist = " + lenDist + " beginEndDist=" + beginEndDist + " breakDist=" + breakDist);
            return lenDist + beginEndDist + breakDist;
        }

        public char recoginze(Path path) {
            Debug.WriteLine("目標：");
            print(path);
            double dmin = double.MaxValue;
            char answer = '0';
            foreach (QA qa in qaList) {
                Debug.WriteLine("候選者 => "+qa.A);
                print(qa.Q);
                double d = dist(path, qa.Q);
                if (d < dmin) {
                    dmin   = d;
                    answer = qa.A;
                }
            }
            return answer;
        }
    }

}
