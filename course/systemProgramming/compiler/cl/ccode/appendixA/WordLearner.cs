using System;
using System.IO;
using System.Collections.Generic;
using System.Text;

class CountMap : Dictionary<String, int>
{
    public void add(String str)
    {
        if (ContainsKey(str))
            this[str]++;
        else
            this.Add(str, 1);
    }
}

class WordLearner
{
    public static String ChineseSymbols = "。，、；：？！「」『』──（）﹝﹞……﹏﹏＿＿‧·";

    public CountMap countMap = new CountMap();

    public static void Main(String[] args)
    {
        String corpus = fileToText(args[0]);
        WordLearner learner = new WordLearner();
        learner.run(corpus);
        List<String> words = learner.getWordList();
        print(words);
    }
	
    public static void print(List<String> words)
    {
        foreach (String word in words)
            Console.WriteLine(word);
    }	
	
    public static String fileToText(String filePath)
    {
        StreamReader file = new StreamReader(filePath);
        String text = file.ReadToEnd();
        file.Close();
        return text;
    }
	

    public WordLearner() {}

    public void run(String corpus)
    {
        count(corpus, countMap);
    }

    public void count(String text, CountMap countMap)
    {
        for (int i = 0; i < text.Length; i++)
        {
            String substr = text.Substring(i, Math.Min(text.Length - i, 6));
            for (int len = 2; len < substr.Length; len++)
            {
                char ch = substr[len-1];
                String head = substr.Substring(0, len);
                countMap.add(head);
                if (ch >= 0 && ch <= 127 || ChineseSymbols.IndexOf(ch) >= 0)
                    break;
            }
        }
    }

    public List<String> getWordList()
    {
        List<String> words = new List<String>();
        CountMap rfreeMap = new CountMap();
        CountMap lfreeMap = new CountMap();
        foreach (String str in countMap.Keys)
        {
            String head = str.Substring(0, str.Length-1);
            String tail = str.Substring(1, str.Length-1);
            rfreeMap.add(head);
            lfreeMap.add(tail);
        }
        foreach (String str in countMap.Keys)
        {
            if (rfreeMap.ContainsKey(str) && lfreeMap.ContainsKey(str))
                if (rfreeMap[str] >= 2 && lfreeMap[str] >= 2)
                    words.Add(lfreeMap[str] + "(" + str + ")" + rfreeMap[str]);
        }
        return words;
    }
}
