import { render, screen } from "@testing-library/react"
import Questions from "./Questions"

test("renders question text", async () => {
    render(<Questions />);

    const questionText = await screen.findByText(/question/i);

    expect(questionText).toBeInTheDocument();
});

test("renders two images", async () => {
    render(<Questions />)
  
    const images = await screen.findAllByRole("img")
  
    expect(images.length).toBe(2)
  });