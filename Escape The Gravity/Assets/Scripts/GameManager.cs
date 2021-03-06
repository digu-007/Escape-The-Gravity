﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviour {

    public delegate void GameDelegate();
    public static event GameDelegate OnGameStarted;
    public static event GameDelegate OnGameOverConfirmed;

    public static GameManager Instance;

    public GameObject StartPage;
    public GameObject GameOverPage;
    public GameObject CountdownPage;
    public Text Score;
    public Text High;
    public Text StartHigh;
    public Text Final;

    string CreateURL = "/api/newscore";
    string tokens = "";

    enum PageState {
        None,
        Start,
        GameOver,
        Countdown
    }

    int score = 0;
    bool gameOver = false;

    public bool GameOver { get { return gameOver; } }

    void Start()
    {
        SetPageState(PageState.Countdown);
    }

    void Awake()
    {
        Instance = this;
    }

    void OnEnable()
    {
        CountdownText.OnCountdownFinished += OnCountdownFinished;
        TapController.OnPlayerDied += OnPlayerDied;
        TapController.OnPlayerScored += OnPlayerScored;
    }

    void OnDisable()
    {
        CountdownText.OnCountdownFinished -= OnCountdownFinished;
        TapController.OnPlayerDied -= OnPlayerDied;
        TapController.OnPlayerScored -= OnPlayerScored;
    }

    void OnCountdownFinished()
    {
        SetPageState(PageState.None);
        OnGameStarted();
        score = 0;
        gameOver = false;
    }

    void OnPlayerDied()
    {
        gameOver = true;
        //savedScore = PlayerPrefs.GetInt("HighScore");
        //if (score > savedScore)
        //{
        //    PlayerPrefs.SetInt("HighScore", score);
        //}
        Final.text = "Score: " + score.ToString();
        //High.text = "Highscore: " + savedScore.ToString();
        SetPageState(PageState.GameOver);
        SendRequest(score);
    }

    void OnPlayerScored()
    {
        score++;
        Score.text = score.ToString();
    }

    void SetPageState(PageState state)
    {
        switch (state) {
            case PageState.None:
                StartPage.SetActive(false);
                GameOverPage.SetActive(false);
                CountdownPage.SetActive(false);
                break;
            case PageState.Start:
                StartPage.SetActive(true);
                GameOverPage.SetActive(false);
                CountdownPage.SetActive(false);
                break;
            case PageState.GameOver:
                StartPage.SetActive(false);
                GameOverPage.SetActive(true);
                CountdownPage.SetActive(false);
                break;
            case PageState.Countdown:
                StartPage.SetActive(false);
                GameOverPage.SetActive(false);
                CountdownPage.SetActive(true);
                break;
        }
    }

    public void ConfirmGameOver() {
        OnGameOverConfirmed();
        Score.text = "0";
        SetPageState(PageState.Start);
        //savedScore = PlayerPrefs.GetInt("HighScore");
        //StartHigh.text = "Highscore: " + savedScore.ToString();
    }

    public void StartGame() {
        SetPageState(PageState.Countdown);
    }

    public void SendRequest(int score)
    {
        WWWForm form = new WWWForm();
        Dictionary<string, string> headers = form.headers;
        form.AddField("score", score.ToString());
        form.AddField("tokens", tokens);
        byte[] rawFormData = form.data;
        WWW www = new WWW(CreateURL, rawFormData, headers);
    }

    public void ctrl(string text)
    {
        tokens = text;
    }
}
