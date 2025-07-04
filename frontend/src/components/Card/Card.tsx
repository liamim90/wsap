import React, { forwardRef, HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

// --- Card ---
type CardProps = HTMLAttributes<HTMLDivElement>

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('card-base-styles rounded-lg border bg-card text-card-foreground shadow-sm', className)}
    {...props}
  />
))
Card.displayName = 'Card'

// --- CardHeader ---
type CardHeaderProps = HTMLAttributes<HTMLDivElement>

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('card-header-styles flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

// --- CardBody ---
type CardBodyProps = HTMLAttributes<HTMLDivElement>

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('card-body-styles p-6 pt-0', className)} {...props} />
))
CardBody.displayName = 'CardBody'

// --- CardFooter ---
type CardFooterProps = HTMLAttributes<HTMLDivElement>

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('card-footer-styles flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardBody, CardFooter } 