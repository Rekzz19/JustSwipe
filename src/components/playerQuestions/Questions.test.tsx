import { render, screen } from "@testing-library/react";
import Questions from "./Questions";

const mockQuestions = {
    question: "who am i?",
    answer : {'name' : "Kawhi Leonard", 'position': "Left"},
    option : "me",
    imageA : "images/Kawhi.jpeg",
    imageB : "images/Klay.jpeg"

}

const mockSwip = {} as any;

test("renders question text", async () => {
    render(<Questions question={mockQuestions} swip={mockSwip} />);

    const questionText = await screen.findByText(/who am i/i);

    expect(questionText).toBeInTheDocument();
});

test("renders two images", async () => {
    render(<Questions question={mockQuestions} swip={mockSwip}/>)
  
    const images = await screen.findAllByRole("img")
  
    expect(images.length).toBe(2)
  });