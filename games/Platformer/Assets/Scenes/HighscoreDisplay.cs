using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using TMPro;
using UnityEngine;

public class HighscoreDisplay : MonoBehaviour
{
    
    public TextMeshProUGUI highscore_text;
    
    [DllImport("__Internal")]
    private static extern int GetHighScore();

    
    // Start is called before the first frame update
    void Start()
    {
        highscore_text.text = "Highscore: " + GetHighScore().ToString();
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
