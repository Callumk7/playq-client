import { Button } from "@/components/ui/button";
import {
  SlideOver,
  SlideOverContent,
  SlideOverTrigger,
} from "@/components/ui/custom/slide-over";
import { Container } from "@/features/layout";

export default function AppIndex() {
  return (
    <Container>
      <SlideOver>
        <SlideOverTrigger>
          <Button>Open</Button>
        </SlideOverTrigger>
        <SlideOverContent>
          <div>
            Elit eu laboris adipisicing sit officia officia quis esse est mollit. Cillum
            ea incididunt velit tempor nisi ad deserunt labore laborum ut. Fugiat laborum
            sint pariatur officia ex consectetur. Occaecat eu ipsum aliqua laboris
            voluptate officia occaecat. Aute cillum occaecat qui mollit amet sint velit.
            Est nulla excepteur commodo ut consectetur excepteur elit mollit dolor
            incididunt eiusmod tempor ut velit. Duis magna ullamco Lorem ipsum nisi. Irure
            velit occaecat magna consequat irure ut tempor voluptate consectetur pariatur
            est.
          </div>
        </SlideOverContent>
      </SlideOver>
    </Container>
  );
}
