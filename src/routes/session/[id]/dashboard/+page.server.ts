import type { PageServerLoad } from './$types';

export const load = (async () => {
    const testData = {
      
          "totalStudents": 15,
          "exercises": [
            {
              "exerciseId": "1",
              "title": "Exercise 1", 
              "completedCount": 5,
              "attemptedCount": 10,
              "submissions": [
                {
                  "name": "Esben",
                  "solution": "solve :: Int -> Int\nsolve x = x + 1",
                  "language": "haskell"
                },
                {
                  "name": "Kato",
                  "solution": "solve :: [Int] -> [Int]\nsolve xs = map (+1) xs",
                  "language": "haskell"
                },
                {
                  "name": "Andreas",
                  "solution": "solve :: String -> String\nsolve s = reverse s",
                  "language": "haskell"
                }
              ]
            },
            {
              "exerciseId": "2",
              "title": "Exercise 2", 
              "completedCount": 3,
              "attemptedCount": 8,
              "submissions": [
                {
                  "name": "Esben",
                  "solution": "solve :: Int -> Bool\nsolve x = x > 0",
                  "language": "haskell"
                },
                {
                  "name": "Kato",
                  "solution": "solve :: [Int] -> Int\nsolve xs = sum xs",
                  "language": "haskell"
                }
              ]
            }
          ]
        
    };

    return {
        testData
    };
}) satisfies PageServerLoad;