using UnityEngine;
using UnityEngine.SceneManagement;

public class Navigator : MonoBehaviour
{
    public void NavigateTo(string sceneName)
    {
        SceneManager.LoadScene(sceneName);
    }

    public void Menu()
    {
        NavigateTo("Menu");        
    }

    public  void Game()
    {
        NavigateTo("Game");
    }
}